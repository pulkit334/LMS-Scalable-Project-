const mongoose = require("mongoose");

const QuizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
      index: true,
    },
    subsectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subSection",
      required: true,
      index: true,
    },
    score: { type: Number, required: true, min: 0 },
    totalQuestions: { type: Number, required: true, min: 1 },
    accuracy: { type: Number, required: true, min: 0, max: 100 },
    weightedScore: { type: Number, required: true, min: 0, max: 100 },
    difficultyBreakdown: {
      easyCorrect: { type: Number, default: 0 },
      easyTotal: { type: Number, default: 0 },
      mediumCorrect: { type: Number, default: 0 },
      mediumTotal: { type: Number, default: 0 },
      hardCorrect: { type: Number, default: 0 },
      hardTotal: { type: Number, default: 0 },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("QuizAttempt", QuizAttemptSchema);
