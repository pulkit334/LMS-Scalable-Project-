const Course = require("../models/course");
const Section = require("../models/section");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    console.log("courseId received:", courseId);

    const testCourse = await Course.findById(courseId);
    console.log("FOUND COURSE:", testCourse);

    if (!testCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const newSection = await Section.create({ sectionName });

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate("courseContent")
      .exec();

    return res.status(201).json({
      success: true,
      message: "section created successfully",
      updatedCourse,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    //fectch the data
    const { SectionName, sectionID } = req.body;
    //validate the data
    if (!SectionName || !sectionID) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    console.log("the data is", sectionID, SectionName);
    //update the data in section as  not need to update id so not need to go to course
    const updatedData = await Section.findByIdAndDelete(
      sectionID,
      { SectionName },
      { new: true }
    );
    //return the respone

    return res.status(200).json({
      success: true,
      message: "section updated successfully",

      updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Unable to Update the section",
      error: err.message,
    });
  }
};

  exports.deleteSection = async (req, res) => {
    console.log("teh id is ",req.params)
    try {
      const { sectionId } = req.params;

      if (!sectionId) {
        return res.status(400).json({
          success: false,
          message: "sectionId is required",
        });
      }

      // 1️⃣ Remove section from course
      const updatedCourse = await Course.findOneAndUpdate(
        { courseContent: sectionId },
        { $pull: { courseContent: sectionId } },
        { new: true }
      ).populate("courseContent");

      if (!updatedCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found for this section",
        });
      }

      // 2️ Delete section document
      // await Section.findByIdAndDelete(sectionId);

      return res.status(200).json({
        success: true,
        message: "Section deleted successfully",
        updatedCourse, // IMPORTANT
      });
    } catch (err) {
      console.error("DELETE SECTION ERROR:", err);
      return res.status(500).json({
        success: false,
        message: "Deletion failed",
        error: err.message,
      });
    }
  };

// ..get section deatiled
exports.section = async (req, res) => {
  try {
    const { sectionId } = req.params;
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required",
      });
    }
    const data = await Section.findById(sectionId).select("sectionName");
    console.log(data);
    return res.status(200).json({
      success: true,
      message: "Fetched...",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to Fetch the User ",
      err: err.message,
    });
  }
};
