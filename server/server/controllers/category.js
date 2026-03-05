const category = require("../models/category");
const { populate } = require("../models/course");

//create Category ka handle functtion expo
// hw create catergory
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
      .find({}, { name: true, description: true,})
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

exports.CategoryPageDatails = async (req, res) => {
  try {
    //get category id
    const { categoryId } = req.body;
    //get courses for specify cateogryid
    const selectedCategory = await category
      .findById(categoryId)
      .populate("course")
      .exec();
    //validate the id
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found...",
      });
    }
    //get course for diffrent categories
    const diffrentCategories = await category
      .findById({
        _id: { $ne: categoryId },
      })
      .populate("course")
      .exec();
    //get top selling courses
    //hw

    //list and return
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        diffrentCategories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};
