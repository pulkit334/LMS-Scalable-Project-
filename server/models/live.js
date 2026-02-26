import mongoose from "mongoose";

const classScehma = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    state: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "ENDED"],
      default: "SCHEDULED",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Class", classScehma);
