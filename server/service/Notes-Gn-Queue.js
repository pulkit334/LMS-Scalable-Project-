import { Worker }   from "bullmq";
import IORedis      from "ioredis";
import {Queue } from "bullmq"
const connection = new IORedis({ maxRetriesPerRequest: null })

export const NotesGnQueue = new Queue("NotesGnQueue", { connection});
