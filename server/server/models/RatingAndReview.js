const mongoose = require("mongoose");
const ratingAndReviewschema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  rating: {
    type: Number,
    required: true,
  },
  Course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    required: true,
  },

  review: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("ratingAndReview", ratingAndReviewschema);
