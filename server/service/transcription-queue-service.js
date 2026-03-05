const { Queue } = require("bullmq")
const IORedis = require("ioredis")    
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
})

const transcriptionQueue = new Queue("TranscriptionQueue", { connection })

module.exports = { transcriptionQueue }