const category = require("../models/category");

const Course = require("../models/course");

exports.Category = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are Required",
      });
    }
    //create entry in db
    const CategoryDetails = await category.create({
      name: name,
      description: description,
    });
    return res.status(200).json({
      success: true,
      message: "Category Created Succesfully",
      CategoryDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// get all Category handler function

exports.AllCategory = async (req, res) => {
  try {
    const AllCategory = await category
      .find({}, { name: true, description: true })
      .populate({
        path: "course",
        populate: {
          path: "courseContent",
        },
      });

    return res.status(200).json({
      success: true,
      message: "ALL category  sent successfully",
      AllCategory,
    });
  } catch (err) {
    return res.status(500).json({
      success: true,
      message: err.message,
    });
  }
};

exports.CategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    // selected category
    const selectedCategory = await category.findById(categoryId).populate({
      path: "course",
      match: { status: "PUBLISHED" },
      populate: "ratingAndReviews",
    });

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // different categories
    const differentCategories = await category
      .find({
        _id: { $ne: categoryId },
      })
      .populate({
        path: "course",
        match: { status: "PUBLISHED" },
        populate: "ratingAndReviews",
      });

    // top selling courses
    let mostSellingCourses = [];

    try {
      mostSellingCourses = await Course.aggregate([
        {
          $match: {
            status: "PUBLISHED",
            category: selectedCategory._id,
          },
        },
        {
          $addFields: {
            totalStudents: {
              $size: { $ifNull: ["$studentEnrolled", []] },
            },
          },
        },
        { $sort: { totalStudents: -1 } },
        { $limit: 5 },
      ]);
    } catch (err) {
      console.error("Most selling aggregation failed:", err.message);
    }
    // const courses = await Course.find({ status: "PUBLISHED" })
    //   .populate("ratingAndReviews")
    //   .lean();

    // const mostSellingCourses = courses
    //   .map(course => ({
    //     ...course,
    //     totalStudents: course.studentEnrolled?.length || 0,
    //   }))
    //   .sort((a, b) => b.totalStudents - a.totalStudents);
return res.status(200).json({
      success: true,
      selectedCategory,
      differentCategories,
      mostSellingCourses,
      name: selectedCategory.name,
      description: selectedCategory.description,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
