require("dotenv").config();
const { Worker } = require("bullmq");
const IORedis    = require("ioredis");
const Transcript = require("../models/transcription");
const Subsection = require("../models/subsection");
//  removed: cloudinary
//  removed: generatePDF

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "NotesGnQueue",
  async (job) => {
    const { subsectionId } = job.data;

    try {
      const transcript = await Transcript.findOne({ subsectionId });
      if (!transcript?.rawText) throw new Error("Transcript Missing or Not Found");

      //  Just verify transcript exists — PDF generated on demand in controller
      await Subsection.findByIdAndUpdate(subsectionId, {
        notesStatus: "done", //  just mark as ready
      });

      console.log(" Notes marked as ready!");

    } catch (err) {
      await Subsection.findByIdAndUpdate(subsectionId, {
        notesStatus: "failed",
      });
      console.error(" Notes worker failed:", err);
      throw err;
    }
  },
  { connection }
);

worker.on("completed", (job) => console.log("Notes done:", job.id));
worker.on("failed",    (job, err) => console.error("❌ Failed:", job?.id, err));