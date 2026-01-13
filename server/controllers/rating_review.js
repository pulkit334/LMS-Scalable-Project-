const { default: mongoose } = require("mongoose");
const RatingAndReviews = require("../models/RatingAndReview");
const Course = require("../models/course");
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
        select: "firstName lastName raing image email",
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
exports.getCourseReviews = async (req,res) => {
  //first get the course id parmas
  try {
    const { courseId} = req.params;
    const dataValidation = await Course.findOne({  courseId})
      .populate("ratingAndReview")
      .exec();

    if (!dataValidation) {
      return res.status(404).json({
        success: false,
        message: "No Reviews Found",
      });
    }
    //nikal so and validate it
    return res.status(200).json({
      success: true,
      data: dataValidation,
    });
  } catch (error) {
    return res.status(403).json({
      success: true,
      message: error.message,
    });
  }
};
