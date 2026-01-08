const course = require("../models/course");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageuploader");
const Section = require("../models/section");
const SubSection = require("../models/subsection");
const RatingAndReview = require("../models/RatingAndReview");
const { default: mongoose } = require("mongoose");
exports.createCourse = async (req, res) => {
  try {
    //fetch all the data

    const {
      courseName,
      courseDescription,
      whatyouwilllearn,
      price,
      category,
      tag,
      requirements,
      benifits,
    } = req.body;

    //get the thumngnail
    if (!req.files || !req.files.thumbnailImage) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }
    console.log(
      "The categoory is dsbhsdhbjcbzxkbzclbjzxlbjzxbjlbjlzlbvzlbkln",
      category
    );

    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatyouwilllearn ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All Field are required",
      });
    }
    //check why db call for instructor

    const userid = req.user.id;

    //check writing in form fo req only
    const instructorDetails = await User.findById(userid);
    //veify that user id and instrucor._id is same or nnot diffrent
    if (!instructorDetails) {
      return res.status(401).json({
        success: false,
        message: "Insturctor details Not Found",
      });
    }
    //check karo given category is valid or not  backed only
    const CategoryDetails = await Category.findById(category);
    if (!CategoryDetails) {
      return res.status(401).json({
        success: false,
        message: "category details not found",
      });
    }

    ///upload image top cloudiinry
    const thumngnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FolderName
    );

    //create an entry for new courseco
    const newCourse = await course.create({
      courseName,
      courseDescription,
      Insturctor: instructorDetails._id,
      whatyouwilllearn: whatyouwilllearn,
      price: price,
      category: CategoryDetails._id,
      thumbnail: thumngnailImage.secure_url,
      tag,
      benifits,
      requirement: requirements,
    });

    //add the new course to the user schema of the user
    const response = await User.findByIdAndUpdate(
      instructorDetails._id,
      {
        $push: { courses: newCourse._id },
      },
      { new: true }
    );

    //update the category  schema
    await Category.findByIdAndUpdate(
      category,
      { $push: { course: newCourse._id } },
      { new: true }
    );

    console.log("the data is ", response);
    res.status(201).json({
      success: true,
      message: "Course Created Succesfully",
      courseId: newCourse._id,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: "Error Ocurred Try Again..",
      error: err.message,
    });
  }
};

//get all course

exports.ShowCourses = async (req, res) => {
  try {
    const instrucorid = req.user.id;
    const AllCourses = await course
      .find({ Insturctor: instrucorid })
      .populate("Insturctor") // ⬅MUST MATCH SCHEMA FIELD NAME
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data Fetched",
      data: AllCourses,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch the Courses",
      error: err.message,
    });
  }
};

// exports.course = async (req, res) => {
//   try {
//     const { courseId } = req.params;
// console.log("THe data is ",courseId)
//     if (!courseId) {
//       return res.status(400).json({
//         success: false,
//         message: "CourseId is required",
//       });
//     }

//     const data = await course
//       .findById(courseId)
//       .populate({
//         path: "courseContent",
//         populate: { path: "SubSection" },
//       })
//       .populate("category")
//       .populate("ratingAndReviews");

//     return res.status(200).json({
//       success: true,
//       message: "Fetched...",
//       data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to Fetch the User",
//       err: err.message,
//     });
//   }
// };

//for the profile section only

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("courses");

    return res.status(200).json({
      success: true,
      courses: user.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};
// for making the course publish  or saved as draft

exports.changestatus = async (req, res) => {
  try {
    const { courseId, isPublic } = req.body;
    console.log(courseId, isPublic);
    const userId = req.user.id;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const Course = await course.findById(courseId);

    if (!Course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    //  Instructor ownership check
    if (Course.Insturctor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to publish this course",
      });
    }
    if (isPublic) {
      Course.status = "PUBLISHED";
    } else {
      Course.status = "DRAFT";
    }
    await Course.save();

    return res.status(200).json({
      success: true,
      message: "Successfully Published",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error Pls Try Again ",
      error,
    });
  }
};

//updation Purpose APi's

exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const courseDetails = await course
      .findById(courseId)
      .populate({
        path: "Insturctor", //  spelling preserved
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate({
        path: "courseContent",
        populate: { path: "subsection" },
      });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //  AUTH CHECK
    if (courseDetails.Insturctor._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this course",
      });
    }

    return res.status(200).json({
      success: true,
      courseDetails,
    });
  } catch (error) {
    console.error("GET FULL COURSE DETAILS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course details",
    });
  }
};
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // 1️ Build update object safely (FIELD WHITELIST)
    const {
      courseName,
      courseDescription,
      whatyouwilllearn,
      price,
      category,
      tag,
      benifits,
      requirements,
      status,
    } = req.body;

    const updatePayload = {
      ...(courseName && { courseName }),
      ...(courseDescription && { courseDescription }),
      ...(whatyouwilllearn && { whatyouwilllearn }),
      ...(price && { price }),
      ...(category && { category }),
      ...(tag && { tag }),
      ...(benifits && { benifits }),
      ...(requirements && { requirement: requirements }),
      ...(status && { status }),
    };

    // 2️ Handle thumbnail update (ONLY if file exists)
    if (req.files?.thumbnailImage) {
      // Fetch ONLY image fields (lean, fast)
      const courseImage = await course
        .findById(courseId)
        .select("image")
        .lean();

      if (!courseImage) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      const publicId =
        courseImage.image?.publicId || `courses/${courseId}/thumbnail`;
      console.log("The public Id is ", courseImage);
      const uploaded = await uploadImageToCloudinary(
        req.files.thumbnailImage,
        process.env.FolderName,
        {
          public_id: publicId,
          overwrite: true,
          invalidate: true,
        }
      );

      updatePayload.image = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      };
    }
    // 3️ Single atomic DB update (FAST)
    const updatedCourse = await course.findByIdAndUpdate(
      courseId,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Course update failed",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    // 1️ Extract IDs
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // 2️ Find course
    console.log("the Course before result is", courseId);
    const Course = await course.findById(courseId);
    console.log("the Course result is this ", Course);
    if (!Course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 3️ Authorization check (VERY IMPORTANT FIX)
    if (Course.Insturctor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this course",
      });
    }

    // 4️ Find all sections of the course (only subSection field)
    const sections = await Section.find(
      { _id: { $in: Course.courseContent } },
      { subSection: 1 }
    ).lean();

    // 5️ Collect all subsection IDs
    const subSectionIds = sections.flatMap((sec) => sec.subSection);

    // 6️ Delete all subsections
    if (subSectionIds.length > 0) {
      await SubSection.deleteMany({
        _id: { $in: subSectionIds },
      });
    }

    // 7️ Delete all sections
    await Section.deleteMany({
      _id: { $in: Course.courseContent },
    });

    // 8️ Remove course from ALL enrolled users
    await User.updateMany(
      { courses: courseId },
      { $pull: { courses: courseId } }
    );

    // 9️ OPTIONAL: remove course from category (safe guard)
    if (Course.category) {
      await Category.findByIdAndUpdate(Course.category, {
        $pull: { courses: courseId },
      });
    }

    //  Finally delete the course itself
    await course.findByIdAndDelete(courseId);

    // 111 Response
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete course",
    });
  }
};

//Get Page Data -> Header
exports.getCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    console.log("courseId:", courseId);

    const data = await course
      .findById(courseId)
      .select(
        "courseName courseDescription price thumbnail category Insturctor totalDuration status studentEnrolled whatyouwilllearn"
      )
      .populate("category", "name")
      .populate("Insturctor", "firstName lastName email");

    console.log("course data:", data);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    //  THIS WAS MISSING
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("GET COURSE ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//Get the Course  Content
exports.getCourseContent = async (req, res) => {

  try {
    const { courseId } = req.params;
    const content = await course
      .findById(courseId)
      .select("courseContent")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection", // must match Section schema ref
          select: "tittle timeduration description videoUrl",
        },
      });

    return res.status(200).json({
      success: true,
      data: content?.courseContent || [],
    });
  } catch (err) {
    console.error("COURSE CONTENT ERROR:", err);
    return res.status(500).json({
      success: false,
      message: err,
    });
  }
};

//Get the Reviews (Pagination )
exports.getPaymentCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    let limit = Number(req.query.limit) || 10;
    if (limit > 40) limit = 20;

    const after = req.query.after;

    // -----------------------
    // 1️Base query
    // -----------------------
    const query = { Course: courseId };
    if (after) {
      query._id = { $lt: after };
    }

    // -----------------------
    // 2 Fetch paginated reviews
    // -----------------------
    const reviews = await RatingAndReview.find(query)
      .sort({ _id: -1 })
      .limit(limit);

    const nextCursor =
      reviews.length > 0 ? reviews[reviews.length - 1]._id : null;

    // -----------------------
    // 3 Get rating stats (AVG + COUNT)
    // -----------------------
    const ratingStats = await RatingAndReview.aggregate([
      { $match: { Course: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const stats = ratingStats[0] || {
      avgRating: 0,
      totalRatings: 0,
    };

    // -----------------------
    // 4 Send response
    // -----------------------
    return res.status(200).json({
      success: true,
      data: reviews,
      nextCursor,
      ratingStats: {
        avgRating: Number(stats.avgRating?.toFixed(1)) || 0,
        totalRatings: stats.totalRatings,
      },
    });
  } catch (err) {
    console.error("COURSE REVIEW ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
    });
  }
};
