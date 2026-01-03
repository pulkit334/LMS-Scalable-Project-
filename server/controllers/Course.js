const course = require("../models/course");
const Category = require("../models/category");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageuploader");

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

    //update the category  schema homework

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
      .find({Insturctor : instrucorid})
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

exports.course = async (req, res) => {
  try {
    const { courseId } = req.params;
    console.log(courseId);
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "CourseId is required",
      });
    }

    const data = await course
      .findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "SubSection" },
      })
      .populate("category")
      .populate("ratingAndReviews");

    return res.status(200).json({
      success: true,
      message: "Fetched...",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch the User",
      err: err.message,
    });
  }
};

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
