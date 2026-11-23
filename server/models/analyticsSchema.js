const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    // Type of notification event
    eventType: {
      type: String,
      required: true,
      index: true,
      enum: [
        "course_launch_notification", // Sent when course published
        "payment_reminder_sent", // Sent 24hrs after pending payment
        "payment_completed_after_reminder", // User paid after reminder
      ],
    },

    // Kisko Rcived Hua Notfication
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Related course (if applicable)
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      default: null,
    },

    // Related payment (if applicable)
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    // // Additional info (optional)
    // metadata: {
    //   courseName: String,
    //   coursePrice: Number,
    //   notificationTitle: String,
    //   notificationBody: String,
    // },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

analyticsSchema.index({ eventType: 1, timestamp: -1 });
analyticsSchema.index({ user: 1, timestamp: -1 });

module.exports = mongoose.model("Analytics", analyticsSchema);
