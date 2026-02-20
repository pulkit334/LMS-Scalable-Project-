const mongoose = require("mongoose");

const subSchema = new mongoose.Schema(
  {
    tittle: {
      type: String,
    },
    timeduration: {
      type: Number, // seconds
      required: true,
    },
    description: {
      type: String,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    // optional fields you may need later
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: [
        "UPLOADED",
        "TRANSCRIBING",
        "GENERATING_QUESTIONS",
        "READY",
        "FAILED",
      ],
    },
    notesStatus: {
      type: String,
      enum: ["pending", "done", "failed", null],
      default: null,
    },
    notesUrl: { type: String, default: null },
    cloudinaryId: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("subSection", subSchema);
