const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: false,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: false,
    },

    accountType: {
      type: String,
      enum: ["admin", "student", "instructor"],
      required: true,
    },
    additionalDetails: {
      type: mongoose.Schema.ObjectId,
      ref: "Profile",
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses", // must match your model name in Course.js
      },
    ],
    status: {
      type: String,
      enum: ["Active", "InActive"],
      default: "Active",
    },
    image: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },
    recoveryToken: {
      type: String,
    },
    recoveryTokenExpires: {
      type: Date,
    },
    token: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],

    isdeleted: {
      type: Boolean,
      default: false,
    },

    deleteRequestedAt: {
      type: Date,
      default: null,
    },

    // optional fields you may need later
    createdAt: {
      type: Date,
      default: Date.now,
    },
 
  },
  {
    timestamps: true,
  },
);
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
});
module.exports = mongoose.model("User", userSchema);
