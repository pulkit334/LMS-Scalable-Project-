const mongoose = require("mongoose");

const Transcribing = new mongoose.Schema(
  {
    subsectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subSection",
      required: true,
    },
    rawText: { type: String, required: true },
    words: { type: JSON, required: true },
    confidence: { type: Number },
    language: {
      type: String,
      enum: ["en", "hi"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

Transcribing.index({ subsectionId: 1 });

module.exports = mongoose.model("transcript", Transcribing);
