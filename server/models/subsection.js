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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("subSection", subSchema);
