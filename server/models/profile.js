const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    firstName : {
      type : String
    },
    lastName : {
      type : String
    },
    gender: {
      type: String,
    },
    dateofBirth: {
      type: String,
    },
    about: {
      type: String,
      trim: true,
    },
    contactNumber: {
      type: Number,
      trim: true,
    },
    isdeleted: {
      type: Boolean,
      default: false,
    },

    deleteRequestedAt: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
