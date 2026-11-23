const mongoose = require("mongoose");

const Questions = new mongoose.Schema(
  {
    subsectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subSection",
      required: true,
      index: true,
    },
    question: {           // ← was "questions", AI returns "question"
      type: String,
      required: true,
    },
    options: {
      type: [String],     // ← was String with enum, should be array of strings
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    explanation: {        // ← was "explantion" (typo)
      type: String,
    },
    difficulty: {
      type: String,       // ← was missing type
      enum: ["EASY", "MEDIUM", "HARD"],
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("Questions", Questions);