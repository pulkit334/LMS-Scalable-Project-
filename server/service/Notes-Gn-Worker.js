require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const Transcript = require("../models/transcription");
const Subsection = require("../models/subsection");

const connection = new IORedis({ maxRetriesPerRequest: null });
const worker = new Worker(
  "NotesGnQueue",
  async (job) => {
    const { subsectionId } = job.data;

    const transcript = await Transcript.findOne({ subsectionId });

    if (!transcript?.rawText) {
      throw new Error("Transcript missing or not found");
    }

    await Subsection.findByIdAndUpdate(subsectionId, {
      notesStatus: "done",
    });
  },
  {
    connection,  //  moved here
    removeOnComplete: {
      age: 3600,
      count: 1000,
    },
    removeOnFail: {
      age: 24 * 3600,
    },
    settings: {
      backoffStrategy: (attemptsMade) => {
        return attemptsMade * 2000;
      },
    },
  }  // 
);

worker.on("failed", (job, err) => console.error("❌ Failed:", job?.id, err));
worker.on("completed", (job) => console.log("Notes done:", job.id));
worker.on("completed", (job) => console.log("Notes done:", job.id));
