const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
      index: true,
    },

    price: {
      type: Number,
      default: 0,
    },

    paymentid: {
      type: String,
      required: true,
    },

    orderid: {
      type: String,
      required: true,
    },

    signature: {
      type: String,
      required: false,
    },

    status: {
      type: String,
      enum: ["success", "pending", "failed"],
      default: "pending",
      index: true,
    },

    //Jab Payment was Intiated 
    // Set this when you create the order in Razorpay
    initiatedAt: {
      type: Date,
      default: Date.now,
    },

    // Track if 24-hour reminder was sent
    reminderSent: {
      type: Boolean,
      default: false,
    },

    //  When reminder was sent
    reminderSentAt: {
      type: Date,
      default: null,
    },

    //Did user complete payment after receiving reminder?
    completedAfterReminder: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PaymentSchema.index({
  initiatedAt: 1,
  status: 1,
  reminderSent: 1,
});

module.exports = mongoose.model("Payment", PaymentSchema);