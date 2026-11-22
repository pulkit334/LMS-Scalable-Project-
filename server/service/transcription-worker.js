require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const { DeepgramClient } = require("@deepgram/sdk");
const Transcript = require("../models/transcription");
const SubSection = require("../models/subsection");
const { QuestionQueue } = require("./questionGen-queue-service");
const { NotesGnQueue } = require("./Notes-Gn-Queue");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

function getDeepgramClient() {
  const apiKey = (process.env.DEEPGRAM_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("DEEPGRAM_API_KEY is missing in environment variables");
  }
  return new DeepgramClient({ apiKey });
}

const worker = new Worker(
  "TranscriptionQueue",
  async (job) => {
    const { subsectionId, cloudinaryUrl } = job.data;

    if (!subsectionId || !cloudinaryUrl) {
      throw new Error("Missing subsectionId or cloudinaryUrl in transcription job");
    }

    console.log(`[TranscriptionWorker] Starting transcription for subsection ${subsectionId}`);

    await SubSection.findByIdAndUpdate(subsectionId, {
      status: "TRANSCRIBING",
      notesStatus: "pending",
    });

    const deepgram = getDeepgramClient();

    // @deepgram/sdk v5 API: deepgram.listen.v1.media.transcribeUrl(request)
    const response = await deepgram.listen.v1.media.transcribeUrl(
      {
        url: cloudinaryUrl,
        model: "nova-2",
        punctuate: true,
        smart_format: true,
        utterances: true,
        detect_language: true,
      },
      { timeoutInSeconds: 180 }
    );

    const result = response?.result || response;
    const channel = result?.results?.channels?.[0];
    const alternative = channel?.alternatives?.[0];
    const rawText = (alternative?.transcript || "").trim();

    if (!rawText) {
      throw new Error("Deepgram returned an empty transcript for this media");
    }

    const detectedLang = channel?.detected_language || "en";

    await Transcript.findOneAndUpdate(
      { subsectionId },
      {
        subsectionId,
        rawText,
        words: Array.isArray(alternative.words) ? alternative.words : [],
        confidence: typeof alternative.confidence === "number" ? alternative.confidence : 0,
        language: detectedLang,
        notesData: null,
        notesModel: null,
      },
      { upsert: true, new: true }
    );

    await SubSection.findByIdAndUpdate(subsectionId, {
      status: "GENERATING_QUESTIONS",
      notesStatus: "pending",
    });

    await QuestionQueue.add(
      "generate-questions",
      { subsectionId: String(subsectionId) },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      }
    );

    await NotesGnQueue.add(
      "generate-Notes",
      { subsectionId: String(subsectionId) },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 5000 },
      }
    );

    console.log(
      `[TranscriptionWorker] Completed transcription for ${subsectionId} (${rawText.length} chars, lang=${detectedLang}). Queued questions & notes.`
    );
  },
  {
    connection,
    concurrency: 2,
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`[TranscriptionWorker] Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  console.error(
    `[TranscriptionWorker] Job ${job?.id} failed on attempt ${job?.attemptsMade}:`,
    err.message
  );
  const maxAttempts = job?.opts?.attempts || 1;
  if (job?.data?.subsectionId && job.attemptsMade >= maxAttempts) {
    try {
      await SubSection.findByIdAndUpdate(job.data.subsectionId, {
        status: "FAILED",
        notesStatus: "failed",
      });
    } catch (updateErr) {
      console.error("[TranscriptionWorker] Failed to mark subsection FAILED:", updateErr.message);
    }
  }
});

module.exports = worker;
