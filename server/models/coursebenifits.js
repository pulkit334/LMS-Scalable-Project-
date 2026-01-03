const { required } = require("joi");
const mongoose = require("mongoose");
const { type } = require("os");

const benifitSchema = new mongoose.Schema(
  {
    benifitMessage: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("benifit", benifitSchema);
