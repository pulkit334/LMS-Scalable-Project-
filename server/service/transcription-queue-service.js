const { Queue } = require("bullmq")
const IORedis = require("ioredis")    
const connection = new IORedis({ maxRetriesPerRequest: null })

const transcriptionQueue = new Queue("TranscriptionQueue", { connection })

module.exports = { transcriptionQueue }