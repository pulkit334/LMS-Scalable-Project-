const mongoose = require("mongoose");

const Transcribing = new mongoose.Schema(
  {
    subsectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subSection",
      required: true,
    },
    rawText: { type: String, required: true },
    words: { type: mongoose.Schema.Types.Mixed, default: [] },
    confidence: { type: Number, default: 0 },
    language: {
      type: String,
      default: "en",
    },
    notesData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    notesModel: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

Transcribing.index({ subsectionId: 1 });

module.exports = mongoose.model("transcript", Transcribing);
