// import dotenv from "dotenv";
// dotenv.config();
// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// import { createClient } from "@deepgram/sdk";
// import Transcript from "../models/transcription.js";
// import SubSection from "../models/subsection.js";
// import { QuestionQueue } from "./questionGen-queue-service.js";
// import { NotesGnQueue } from "./Notes-Gn-Queue.js";

// const connection = new IORedis({ maxRetriesPerRequest: null });
// const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// const worker = new Worker(
//   "TranscriptionQueue",
//   async (job) => {
//     const { subsectionId, cloudinaryUrl } = job.data;

//     const { result } = await deepgram.listen.prerecorded.transcribeUrl(
//       { url: cloudinaryUrl },
//       { punctuate: true, smart_format: true, utterances: true, words: true },
//     );

//     if (!result?.results?.channels?.[0]?.alternatives?.[0]) {
//       throw new Error("Deepgram returned empty result");
//     }

//     const transcript = result.results.channels[0].alternatives[0];

//     await Transcript.create({
//       subsectionId,
//       rawText: transcript.transcript,
//       words: transcript.words,
//       confidence: transcript.confidence,
//       language: "en",
//     });

//     await SubSection.findByIdAndUpdate(subsectionId, {
//       status: "GENERATING_QUESTIONS",
//     });

//     await QuestionQueue.add("generate-questions", { subsectionId });
//     await NotesGnQueue.add("generate-Notes", { subsectionId });
//   },
//   {
//     removeOnComplete: {
//       age: 3600,
//       count: 1000,
//     },
//     removeOnFail: {
//       age: 24 * 3600,
//     },
  
//     connection,
//     settings: {
//       backoffStrategy: (attemptsMade) => {
//         return attemptsMade * 2000;
//       },
//     },
//   },
// );

// worker.on("completed", (job) => console.error("Transcription done:", job.id));
// worker.on("failed", (job, err) => {
//   console.error(
//     `Job ${job?.id} failed on attempt ${job?.attemptsMade}:`,
//     err.message,
//   );
// });
// import dotenv from "dotenv";
// dotenv.config();
// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const deepgramSDK = require("@deepgram/sdk");
// const createClient = deepgramSDK.createClient 
//   || deepgramSDK.default?.createClient 
//   || deepgramSDK.Deepgram;
// import Transcript from "../models/transcription.js";
// import SubSection from "../models/subsection.js";
// import { QuestionQueue } from "./questionGen-queue-service.js";
// import { NotesGnQueue } from "./Notes-Gn-Queue.js";
// const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
//   maxRetriesPerRequest: null,
//   enableReadyCheck: false,
//   tls: process.env.REDIS_URL?.startsWith("rediss://")
//     ? { rejectUnauthorized: false }
//     : undefined,
// });
// const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// const worker = new Worker(
//   "TranscriptionQueue",
//   async (job) => {
//     const { subsectionId, cloudinaryUrl } = job.data;

//     const { result } = await deepgram.listen.prerecorded.transcribeUrl(
//       { url: cloudinaryUrl },
//       { punctuate: true, smart_format: true, utterances: true, words: true },
//     );

//     if (!result?.results?.channels?.[0]?.alternatives?.[0]) {
//       throw new Error("Deepgram returned empty result");
//     }

//     const transcript = result.results.channels[0].alternatives[0];

//     await Transcript.create({
//       subsectionId,
//       rawText: transcript.transcript,
//       words: transcript.words,
//       confidence: transcript.confidence,
//       language: "en",
//     });

//     await SubSection.findByIdAndUpdate(subsectionId, {
//       status: "GENERATING_QUESTIONS",
//     });

//     await QuestionQueue.add("generate-questions", { subsectionId });
//     await NotesGnQueue.add("generate-Notes", { subsectionId });
//   },
//   {
//     removeOnComplete: {
//       age: 3600,
//       count: 1000,
//     },
//     removeOnFail: {
//       age: 24 * 3600,
//     },

//     connection,
//     settings: {
//       backoffStrategy: (attemptsMade) => {
//         return attemptsMade * 2000;
//       },
//     },
//   },
// );

// worker.on("completed", (job) => console.error("Transcription done:", job.id));
// worker.on("failed", (job, err) => {
//   console.error(
//     `Job ${job?.id} failed on attempt ${job?.attemptsMade}:`,
//     err.message,
//   );
// });
import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { DeepgramClient } = require("@deepgram/sdk");
import Transcript from "../models/transcription.js";
import SubSection from "../models/subsection.js";
import { QuestionQueue } from "./questionGen-queue-service.js";
import { NotesGnQueue } from "./Notes-Gn-Queue.js";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  tls: process.env.REDIS_URL?.startsWith("rediss://")
    ? { rejectUnauthorized: false }
    : undefined,
});

const deepgram = new DeepgramClient(process.env.DEEPGRAM_API_KEY);

const worker = new Worker(
  "TranscriptionQueue",
  async (job) => {
    const { subsectionId, cloudinaryUrl } = job.data;

    const { result } = await deepgram.listen.prerecorded.transcribeUrl(
      { url: cloudinaryUrl },
      { punctuate: true, smart_format: true, utterances: true, words: true },
    );

    if (!result?.results?.channels?.[0]?.alternatives?.[0]) {
      throw new Error("Deepgram returned empty result");
    }

    const transcript = result.results.channels[0].alternatives[0];

    await Transcript.create({
      subsectionId,
      rawText: transcript.transcript,
      words: transcript.words,
      confidence: transcript.confidence,
      language: "en",
    });

    await SubSection.findByIdAndUpdate(subsectionId, {
      status: "GENERATING_QUESTIONS",
    });

    await QuestionQueue.add("generate-questions", { subsectionId });
    await NotesGnQueue.add("generate-Notes", { subsectionId });
  },
  {
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600,
    },

    connection,
    settings: {
      backoffStrategy: (attemptsMade) => {
        return attemptsMade * 2000;
      },
    },
  },
);

worker.on("completed", (job) => console.error("Transcription done:", job.id));
worker.on("failed", (job, err) => {
  console.error(
    `Job ${job?.id} failed on attempt ${job?.attemptsMade}:`,
    err.message,
  );
});