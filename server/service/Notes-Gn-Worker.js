require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const Transcript = require("../models/transcription");
const Subsection = require("../models/subsection");
const generatePDF = require("../utils/GeneratePdf");
const { generateLectureNotes } = require("./openrouter-service");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

const cacheRedis = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

const worker = new Worker(
  "NotesGnQueue",
  async (job) => {
    const { subsectionId } = job.data;

    const [transcript, subsection] = await Promise.all([
      Transcript.findOne({ subsectionId }),
      Subsection.findById(subsectionId).lean(),
    ]);

    if (!transcript?.rawText) {
      throw new Error("Transcript missing or not found");
    }

    console.log(`[NotesWorker] Generating AI notes via OpenRouter for subsection ${subsectionId}`);

    const { data: notes, modelUsed } = await generateLectureNotes(
      transcript.rawText,
      { lectureTitle: subsection?.tittle || "" }
    );

    // Persist structured notes in MongoDB so PDF can always be rebuilt without re-calling AI
    transcript.notesData = notes;
    transcript.notesModel = modelUsed;
    await transcript.save();

    // Pre-generate and cache PDF in Redis for instant downloads
    const pdfBuffer = await generatePDF(notes);
    await cacheRedis.setex(`notes:${subsectionId}`, 86400, pdfBuffer);

    await Subsection.findByIdAndUpdate(subsectionId, {
      notesStatus: "done",
    });

    console.log(
      `[NotesWorker] Notes ready & cached for ${subsectionId} using ${modelUsed}`
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
  console.log(`[NotesWorker] Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  console.error(
    `[NotesWorker] Job ${job?.id} failed on attempt ${job?.attemptsMade}:`,
    err.message
  );
  const maxAttempts = job?.opts?.attempts || 1;
  if (job?.data?.subsectionId && job.attemptsMade >= maxAttempts) {
    try {
      await Subsection.findByIdAndUpdate(job.data.subsectionId, {
        notesStatus: "failed",
      });
    } catch (updateErr) {
      console.error("[NotesWorker] Failed to mark notesStatus failed:", updateErr.message);
    }
  }
});

module.exports = worker;
