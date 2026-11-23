require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const Transcript = require("../models/transcription");
const Question = require("../models/questionModal");
const SubSection = require("../models/subsection");
const { generateQuizQuestions } = require("./openrouter-service");

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
  "QuestionQueue",
  async (job) => {
    const { subsectionId } = job.data;

    const transcript = await Transcript.findOne({ subsectionId }).lean();
    if (!transcript?.rawText) {
      throw new Error("Transcript not found or empty");
    }

    console.log(`[QuestionWorker] Generating questions via OpenRouter for subsection ${subsectionId}`);

    const { data: questions, modelUsed } = await generateQuizQuestions(
      transcript.rawText
    );

    // Replace existing questions cleanly on retry or regeneration
    await Question.deleteMany({ subsectionId });
    const savedQuestions = await Question.insertMany(
      questions.map((q) => ({ ...q, subsectionId }))
    );

    await cacheRedis.setex(
      `questions:${subsectionId}`,
      900, // 15-minute cache TTL before fresh questions can be generated
      JSON.stringify(savedQuestions)
    );

    await SubSection.findByIdAndUpdate(subsectionId, { status: "READY" });

    console.log(
      `[QuestionWorker] Saved ${savedQuestions.length} questions for ${subsectionId} using ${modelUsed}`
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
  console.log(`[QuestionWorker] Job ${job.id} completed`);
});

worker.on("failed", async (job, err) => {
  console.error(
    `[QuestionWorker] Job ${job?.id} failed on attempt ${job?.attemptsMade}:`,
    err.message
  );
  const maxAttempts = job?.opts?.attempts || 1;
  if (job?.data?.subsectionId && job.attemptsMade >= maxAttempts) {
    try {
      await SubSection.findByIdAndUpdate(job.data.subsectionId, {
        status: "FAILED",
      });
    } catch (updateErr) {
      console.error("[QuestionWorker] Failed to mark subsection FAILED:", updateErr.message);
    }
  }
});

module.exports = worker;
