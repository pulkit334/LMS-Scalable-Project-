import { Worker }   from "bullmq";
import IORedis      from "ioredis";
import {Queue } from "bullmq"
const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
})

export const NotesGnQueue = new Queue("NotesGnQueue", { connection});
