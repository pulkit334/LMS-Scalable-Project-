const mongoose = require("mongoose");

const NotificaitonSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
    ref: "User",
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  image: {
    type: String,
  },

 type: {
    type: String,
    enum: ["PAYMENT", "COURSE", "SYSTEM"],
    default: "SYSTEM",
  },
  read: {
    type: Boolean,
    default: false,
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  expiresat: {
    type: Date,
    index: { expires: "7d" },
  },
},  { timestamps: false });

module.exports = mongoose.model("NotificationSchema",NotificaitonSchema);
