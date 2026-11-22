const Question = require("../models/questionModal");
const Subsection = require("../models/subsection");
const Transcript = require("../models/transcription");
const QuizAttempt = require("../models/quizAttempt");
const generatePDF = require("../utils/GeneratePdf");
const {
  generateQuizQuestions,
  generateLectureNotes,
  answerLectureDoubt,
} = require("../service/openrouter-service");
const { transcriptionQueue } = require("../service/transcription-queue-service");
const { NotesGnQueue } = require("../service/Notes-Gn-Queue");
const IORedis = require("ioredis");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const redis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

const QUESTION_CACHE_TTL_SECONDS = 15 * 60; // 15 minutes per-user/lecture cache before refreshing new questions

exports.GetAiRoute = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user?.id || "global";

    // 1. Check 15-minute Redis cache (per-user first, then shared lecture cache)
    const userCacheKey = `questions:${lectureId}:user:${userId}`;
    const sharedCacheKey = `questions:${lectureId}`;
    const cached = (await redis.get(userCacheKey)) || (await redis.get(sharedCacheKey));
    if (cached) {
      const ttl = await redis.ttl(userCacheKey);
      return res.status(200).json({
        success: true,
        cached: true,
        cacheTtlSeconds: ttl > 0 ? ttl : QUESTION_CACHE_TTL_SECONDS,
        data: JSON.parse(cached),
      });
    }

    // 2. Check DB — reuse if created within the last 15 minutes
    const existingQuestions = await Question.find({ subsectionId: lectureId })
      .sort({ createdAt: -1 })
      .lean();
    const newestCreatedAt = existingQuestions?.[0]?.createdAt
      ? new Date(existingQuestions[0].createdAt).getTime()
      : 0;
    const isFresh =
      existingQuestions.length > 0 &&
      Date.now() - newestCreatedAt < QUESTION_CACHE_TTL_SECONDS * 1000;

    if (isFresh) {
      const remainingSeconds = Math.max(
        60,
        Math.ceil(
          (QUESTION_CACHE_TTL_SECONDS * 1000 - (Date.now() - newestCreatedAt)) / 1000
        )
      );
      await Promise.all([
        redis.setex(userCacheKey, remainingSeconds, JSON.stringify(existingQuestions)),
        redis.setex(sharedCacheKey, remainingSeconds, JSON.stringify(existingQuestions)),
      ]);
      return res.status(200).json({
        success: true,
        cached: true,
        cacheTtlSeconds: remainingSeconds,
        data: existingQuestions,
      });
    }

    // 3. Cache expired (>15 min) or no questions yet — check transcript to generate fresh questions
    const transcript = await Transcript.findOne({ subsectionId: lectureId }).lean();
    if (!transcript?.rawText) {
      // If old DB questions exist, return them rather than failing
      if (existingQuestions.length > 0) {
        await redis.setex(
          userCacheKey,
          QUESTION_CACHE_TTL_SECONDS,
          JSON.stringify(existingQuestions)
        );
        return res.status(200).json({
          success: true,
          cached: true,
          data: existingQuestions,
        });
      }

      // Auto-trigger transcription if the lecture has a videoUrl and isn't already transcribing
      const subsection = await Subsection.findById(lectureId);
      if (subsection?.videoUrl) {
        if (subsection.status !== "TRANSCRIBING") {
          subsection.status = "TRANSCRIBING";
          subsection.notesStatus = "pending";
          await subsection.save();

          await transcriptionQueue.add(
            "transcribe",
            {
              subsectionId: String(subsection._id),
              cloudinaryUrl: subsection.videoUrl,
              cloudinaryId: subsection.cloudinaryId || null,
            },
            {
              attempts: 3,
              backoff: { type: "exponential", delay: 4000 },
            }
          );
        }

        return res.status(202).json({
          success: false,
          status: "transcribing",
          message:
            "Lecture video is being transcribed. Questions will be ready shortly — please try again in a few seconds.",
        });
      }

      return res.status(404).json({
        success: false,
        status: "no_transcript",
        message: "Transcript not found, cannot generate questions",
      });
    }

    // 4. Generate fresh conceptual MCQs via OpenRouter fallback chain (with graceful fallback to existing DB questions)
    let savedQuestions;
    let modelUsed = null;
    try {
      const result = await generateQuizQuestions(transcript.rawText);
      modelUsed = result.modelUsed;

      await Question.deleteMany({ subsectionId: lectureId });
      savedQuestions = await Question.insertMany(
        result.data.map((q) => ({
          subsectionId: lectureId,
          question: q.question,
          options: q.options,
          answer: q.answer,
          explanation: q.explanation,
          difficulty: q.difficulty,
        }))
      );

      await Subsection.findByIdAndUpdate(lectureId, { status: "READY" });
    } catch (aiErr) {
      if (existingQuestions.length > 0) {
        console.warn("[GetAiRoute] AI refresh failed, serving previous DB questions:", aiErr.message);
        savedQuestions = existingQuestions;
      } else {
        throw aiErr;
      }
    }

    // 5. Cache for 15 minutes (900 seconds) and return
    await Promise.all([
      redis.setex(userCacheKey, QUESTION_CACHE_TTL_SECONDS, JSON.stringify(savedQuestions)),
      redis.setex(sharedCacheKey, QUESTION_CACHE_TTL_SECONDS, JSON.stringify(savedQuestions)),
    ]);

    return res.status(200).json({
      success: true,
      cached: false,
      cacheTtlSeconds: QUESTION_CACHE_TTL_SECONDS,
      data: savedQuestions,
      modelUsed,
    });
  } catch (err) {
    console.error("Error in GetAiRoute:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
};

exports.GetAiNotesRoute = async (req, res) => {
  try {
    const { subsectionId } = req.params;

    const subsection = await Subsection.findById(subsectionId);
    if (!subsection) {
      return res
        .status(404)
        .json({ success: false, message: "Lecture not found" });
    }

    if (subsection.notesStatus === "done") {
      return res.status(200).json({
        success: true,
        status: "done",
      });
    }

    if (subsection.notesStatus === "pending") {
      return res.status(200).json({
        success: true,
        status: "pending",
        message: "Notes are being generated...",
      });
    }

    // If notesStatus is null or failed, check if transcript exists and queue generation
    const transcript = await Transcript.findOne({ subsectionId }).lean();
    if (transcript?.rawText) {
      subsection.notesStatus = "pending";
      await subsection.save();

      await NotesGnQueue.add(
        "generate-Notes",
        { subsectionId: String(subsectionId) },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
        }
      );

      return res.status(200).json({
        success: true,
        status: "pending",
        message: "Generating AI study notes...",
      });
    }

    // No transcript yet — trigger transcription automatically if videoUrl exists
    if (subsection.videoUrl) {
      if (subsection.status !== "TRANSCRIBING") {
        subsection.status = "TRANSCRIBING";
        subsection.notesStatus = "pending";
        await subsection.save();

        await transcriptionQueue.add(
          "transcribe",
          {
            subsectionId: String(subsection._id),
            cloudinaryUrl: subsection.videoUrl,
            cloudinaryId: subsection.cloudinaryId || null,
          },
          {
            attempts: 3,
            backoff: { type: "exponential", delay: 4000 },
          }
        );
      }

      return res.status(200).json({
        success: true,
        status: "pending",
        message: "Transcribing lecture video first...",
      });
    }

    return res.status(200).json({
      success: false,
      status: "no_transcript",
      message: "No transcript or video available for this lecture.",
    });
  } catch (err) {
    console.error("Error in GetAiNotesRoute:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.DownloadNotes = async (req, res) => {
  try {
    const { subsectionId } = req.params;

    // 1. Check Redis PDF cache first
    const cached = await redis.getBuffer(`notes:${subsectionId}`);
    if (cached) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="lecture-notes.pdf"`
      );
      return res.send(cached);
    }

    // 2. Check MongoDB transcript (and persisted notesData)
    const [transcript, subsection] = await Promise.all([
      Transcript.findOne({ subsectionId }),
      Subsection.findById(subsectionId).lean(),
    ]);

    if (!transcript?.rawText) {
      return res
        .status(404)
        .json({ success: false, message: "Transcript not found" });
    }

    let notes = transcript.notesData;
    if (!notes || !Array.isArray(notes.sections) || notes.sections.length === 0) {
      // Generate fresh via OpenRouter 6-model fallback chain
      const result = await generateLectureNotes(transcript.rawText, {
        lectureTitle: subsection?.tittle || "",
      });
      notes = result.data;

      transcript.notesData = notes;
      transcript.notesModel = result.modelUsed;
      await transcript.save();

      await Subsection.findByIdAndUpdate(subsectionId, { notesStatus: "done" });
    }

    const pdfBuffer = await generatePDF(notes);

    // 3. Cache PDF in Redis for 24h
    await redis.setex(`notes:${subsectionId}`, 86400, pdfBuffer);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="lecture-notes.pdf"`
    );
    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Error in DownloadNotes:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate notes PDF",
    });
  }
};

exports.AskLectureTutor = async (req, res) => {
  try {
    const { subsectionId } = req.params;
    const { question, history = [] } = req.body || {};

    if (!question || !String(question).trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question",
      });
    }

    const [transcript, subsection] = await Promise.all([
      Transcript.findOne({ subsectionId }).lean(),
      Subsection.findById(subsectionId).lean(),
    ]);

    if (!subsection && !transcript) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    const result = await answerLectureDoubt(
      transcript?.rawText || "",
      question,
      history,
      {
        lectureTitle: subsection?.tittle || "",
        lectureDescription: subsection?.description || "",
      }
    );

    return res.status(200).json({
      success: true,
      answer: result.answer,
      modelUsed: result.modelUsed,
    });
  } catch (err) {
    console.error("Error in AskLectureTutor:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to get AI tutor response",
    });
  }
};

exports.SubmitQuizAttempt = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user?.id;
    const {
      courseId = null,
      score = 0,
      totalQuestions = 5,
      difficultyBreakdown = {},
    } = req.body || {};

    const safeTotal = Math.max(1, Number(totalQuestions) || 1);
    const safeScore = Math.max(0, Math.min(safeTotal, Number(score) || 0));
    const accuracy = Math.round((safeScore / safeTotal) * 1000) / 10;

    // Difficulty-weighted score (EASY=1.0, MEDIUM=1.5, HARD=2.2)
    const bd = {
      easyCorrect: Number(difficultyBreakdown.easyCorrect) || 0,
      easyTotal: Number(difficultyBreakdown.easyTotal) || 0,
      mediumCorrect: Number(difficultyBreakdown.mediumCorrect) || 0,
      mediumTotal: Number(difficultyBreakdown.mediumTotal) || 0,
      hardCorrect: Number(difficultyBreakdown.hardCorrect) || 0,
      hardTotal: Number(difficultyBreakdown.hardTotal) || 0,
    };
    const maxWeight =
      bd.easyTotal * 1.0 + bd.mediumTotal * 1.5 + bd.hardTotal * 2.2;
    const earnedWeight =
      bd.easyCorrect * 1.0 + bd.mediumCorrect * 1.5 + bd.hardCorrect * 2.2;
    const weightedScore =
      maxWeight > 0
        ? Math.round((earnedWeight / maxWeight) * 1000) / 10
        : accuracy;

    const attempt = await QuizAttempt.create({
      userId,
      courseId: courseId || null,
      subsectionId: lectureId,
      score: safeScore,
      totalQuestions: safeTotal,
      accuracy,
      weightedScore,
      difficultyBreakdown: bd,
    });

    return res.status(201).json({
      success: true,
      data: attempt,
    });
  } catch (err) {
    console.error("Error in SubmitQuizAttempt:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to record quiz attempt",
    });
  }
};
