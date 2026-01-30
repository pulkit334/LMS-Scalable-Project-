const mongoose = require("mongoose");
const courseSchema = new mongoose.Schema({
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
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  ],
  // optional fields you may need later
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps : true});
courseSchema.index({ Insturctor: 1 });
courseSchema.index({ status: 1 });
courseSchema.index({courseName : "text",  description: "text",})
module.exports = mongoose.model("Courses", courseSchema);
// courseSchema.index({ Insturctor: 1 });
// courseSchema.index({ status: 1 });
// courseSchema.index({
//   courseName: "text",
//   courseDescription: "text",
//   tag: "text",
// // });