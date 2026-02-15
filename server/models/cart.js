// models/Cart.js
const { boolean } = require("joi");
const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },

  items: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
      },
      price: Number,
      title: String,
      thumbnail: String,
    },
  ],

  itemCount: {
    type: Number,
    default: 0,
  },

  totalPrice: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Track reminder
  reminderSent: {
    type: Boolean,
    default: false,
  },
  reminderType: {
    type: String,
    enum: ["email_and_notification", "notification_only", "email_only"],
    default: null,
  },
  reminderSentAt: {
    type: Date,
    default: null,
  },
});

CartSchema.index({ user: 1, createdAt: 1, reminderSent: 1 });

module.exports = mongoose.model("Cart", CartSchema);
