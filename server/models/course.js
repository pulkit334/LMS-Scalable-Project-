const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      trim: true,
    },

    courseDescription: {
      type: String,
    },

    Insturctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    whatyouwilllearn: {
      type: String,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED"],
      default: "DRAFT",
    },

    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    ratingAndReviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratingAndReview",
      },
    ],

    price: {
      type: Number,
      default: 0,
    },

    thumbnail: {
      type: String,
    },

    tag: {
      type: String,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },

    totalDuration: {
      type: String,
      default: "0 mins",
    },

    benifits: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "benifit",
    },

    requirement: {
      type: String,
    },

    studentEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],

    // Track if launch notification was sent
    launchNotificationSent: {
      type: Boolean,
      default: false,
    },

    // When notification was sent
    launchNotificationDate: {
      type: Date,
      default: null,
    },

    //  When course was published
    publishedAt: {
      type: Date,
      default: null,
    },

    // Track last content update notification
    lastContentUpdateNotification: {
      type: Date,
      default: null,
    },

    // Prevent spam - don't notify for every tiny edit
    contentUpdatesPendingNotification: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

courseSchema.index({ Insturctor: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({ courseName: "text", courseDescription: "text" });
courseSchema.index({ launchNotificationSent: 1 });
courseSchema.index({ publishedAt: -1 });

module.exports = mongoose.model("Courses", courseSchema);
