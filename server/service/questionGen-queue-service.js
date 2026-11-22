require("dotenv").config();
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(redisUrl, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: redisUrl.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

const QuestionQueue = new Queue("QuestionQueue", { connection });

module.exports = { QuestionQueue };
