import dotenv from "dotenv"
dotenv.config()
import { Worker } from "bullmq"
import IORedis from "ioredis"
import { createClient } from "@deepgram/sdk"
import Transcript from "../models/transcription.js"
import SubSection from "../models/subsection.js"
import { QuestionQueue } from "./questionGen-queue-service.js"

const connection = new IORedis({ maxRetriesPerRequest: null })
const deepgram = createClient(process.env.DEEPGRAM_API_KEY)

const worker = new Worker("TranscriptionQueue", async (job) => {
  const { subsectionId, cloudinaryUrl } = job.data

  const { result } = await deepgram.listen.prerecorded.transcribeUrl(
    { url: cloudinaryUrl },
    { punctuate: true, smart_format: true, utterances: true, words: true }
  )

  const transcript = result.results.channels[0].alternatives[0]
console.log("Deepgram result:", JSON.stringify(transcript, null, 2))
  await Transcript.create({
    subsectionId,
    rawText: transcript.transcript,
    words: transcript.words,
    confidence: transcript.confidence,
    language: "en",
  })

  await SubSection.findByIdAndUpdate(subsectionId, { status: "GENERATING_QUESTIONS" })

  await QuestionQueue.add("generate-questions", { subsectionId })

}, { connection })

worker.on("completed", (job) => console.log("Transcription done:", job.id))
worker.on("failed", (job, err) => console.error(`Job ${job?.id} failed:`, err))