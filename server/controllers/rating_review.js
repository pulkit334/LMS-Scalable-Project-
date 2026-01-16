const { default: mongoose } = require("mongoose");
const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/course");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
//creatae rating
exports.createRating = async (req, res) => {
  try {
    //get user id
    const userid = req.user.id;
    const { rating, review } = req.body;
    const { courseId } = req.params;

    //verify the user id if not in course or Not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userid } },
    });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is Not Enrolled in Course",
      });
    }

    //only allow once for review
    const AleradyReviwed = await RatingAndReviews.findOne({
      user: userid,
      Course: courseId,
    });

    if (AleradyReviwed) {
      return res.status(403).json({
        success: false,
        message: "Course is Alerady Reviewed By the User",
      });
    }

    //create teh rating reveiw
    const ratingDb = await RatingAndReviews.create({
      rating: rating,
      review: review,
      Course: courseId,
      user: userid,
    });

    //update the course id with course
    // const update detiled//
    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          ratingAndReviews: ratingDb._id,
        },
      },
      { new: true }
    );

    //return the response
    return res.status(201).json({
      success: true,
      message: "Rating Done....",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//avg rating]
exports.getAverageRating = async (req, res) => {
  try {
    //get course id
    // const course_id = req.body.courseid;
    const { courseId } = req.params;
    //calculate avergae rating
    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          //why starting me srtign thi so convert to obejct id
          Course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }
    //return the rating
    return res.status(200).json({
      success: true,
      message: "Average Rating's is Given Till Now is Zero",
    });
  } catch (error) {
    return res.status(403).json({
      success: true,
      message: error.message,
    });
  }
};
//get all raing

exports.getAllRatingReviews = async (req, res) => {
  try {
    //find call then return
    const AllData = await RatingAndReviews.find({})
      .populate({
        path: "user",
        select: "firstName lastName rating review image email",
      })
      .populate("Course")
      .sort({ rating: -1 })
      .exec();

    if (!AllData) {
      res.status(404).json({
        success: false,
        message: "No Reviews Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "All Reviews Fetched successfully",
      data: AllData,
    });
  } catch (err) {
    return res.status(403).json({
      success: true,
      message: err.message,
    });
  }
};
// Get Course Related Reveiw

exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    const reviews = await RatingAndReview.find({ Course: courseId })
      .populate("user", "firstName lastName image")
      .sort({ createdAt: -1 });

    console.log("the Review is", reviews);
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No reviews found for this course",
      });
    }
    console.log("the data is ", reviews);
    return res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log("the Error is", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.sliderReview = async (req, res) => {
  try {
    const limit = 10;
    const response = await RatingAndReview.find({})
      .populate("Course", "thumbnail courseName")
      .populate("user", "firstName lastName")
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .exec();
    return res.status(200).json({
      success: true,
      message: "General homepage reviews fetched",
      data: response,
    });
  } catch (error) {
    console.log("the server side Cotroller Error is", error);
    return res.status(500).json({
      success: false,
      message: "Failed Try Again",
    });
  }
};
exports.updateRating = async (req, res) => {
  try {
    //course Id;
    //user Id
    const { reviewId } = req.params;
    const user = req.user.id;
    const { rating, review } = req.body;
    const ValidData = await RatingAndReviews.findById(reviewId);
    if (!ValidData) {
      return res.status(404).json({
        success: false,
        message: "Resource Not Found",
      });
    }
    //validation of the user
    if (ValidData.user.toString() !== user) {
      return res.json(403).json({
        success: false,
        message: "Unothorizted Access",
      });
    }

    if (rating !== undefined) ValidData.rating = rating;
    if (review !== undefined) ValidData.review = review;

    await ValidData.save();
    return res.status(200).json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Failed Try Again",
    });
  }
};
