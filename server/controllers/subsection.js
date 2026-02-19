const SubSection = require("../models/subsection");
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageuploader");
const course = require("../models/course");

exports.createSubsection = async (req, res) => {
  try {
    console.log("The Data is ", req.body);
    // fetch the data
    const { sectionId, timeDuration, tittle, description } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const video = req.files.videoFile;

    // validation
    if (!sectionId || !tittle || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FolderName,
    );

    // create subsection
    const subsection = await SubSection.create({
      tittle,
      timeduration: timeDuration,
      description,
      cloudinaryId: uploadDetails.public_id,
      status: "UPLOADED",
      videoUrl: uploadDetails.secure_url,
    });

    // update the section with this subsection id
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subsection: subsection._id },
      },
      { new: true },
    ).populate("subsection");

    /* ================= COURSE DURATION UPDATE ================= */

    const section = await Section.findById(sectionId);

    const courseDoc = await course.findById(section.courseId).populate({
      path: "courseContent",
      populate: { path: "subsection" },
    });

    let totalSeconds = 0;

    courseDoc.courseContent.forEach((sec) => {
      sec.subsection.forEach((lec) => {
        totalSeconds += lec.timeduration;
      });
    });

    courseDoc.totalDuration = `${Math.ceil(totalSeconds / 60)} mins`;
    await courseDoc.save();

    /* ========================================================== */

    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
      subsection,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create subsection",
      error: err.message,
    });
  }
};

exports.subsection = async (req, res) => {
  try {
    const { subSectionId } = req.params;

    // MISTAKE #5: WRONG .select() SYNTAX (COMMAS)
    // FIX: USE SPACES ONLY
    const data = await SubSection.findById(subSectionId).select(
      "tittle timeduration description vediourl",
    );

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Failed to Load Subsection...",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched Subsection...",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to Fetch Subsection",
      error: err.message,
    });
  }
};

//Subsection Update
// Helper function - OUTSIDE the main function
const deleteCloudinaryVideo = async (videoUrl) => {
  if (!videoUrl) return;

  try {
    const parts = videoUrl.split("/upload/")[1];
    if (!parts) {
      console.warn(" Invalid Cloudinary URL format:", videoUrl);
      return;
    }

    const pathSegments = parts.split("/");
    const publicId = pathSegments
      .slice(1)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    if (!publicId) {
      console.warn(" Could not extract public_id");
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    if (result.result === "ok") {
      console.log(" Video deleted:", publicId);
    } else {
      console.warn(" Deletion result:", result);
    }
  } catch (error) {
    console.error(" Cloudinary deletion failed:", {
      error: error.message,
      url: videoUrl,
    });
  }
};

// Main function
exports.UpdateSubsection = async (req, res) => {
  try {
    const SubsectionId = req.params.subSectionId;
    const subsection = await SubSection.findById(SubsectionId);

    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection Don't Exist",
      });
    }

    const { tittle, description } = req.body;
    let uploadDetails = null;

    if (req.files && req.files.videoFile) {
      const oldVideoUrl = subsection.videoUrl;
      const vedio = req.files.videoFile;

      console.log("the vedio details would be", vedio);

      uploadDetails = await uploadImageToCloudinary(
        vedio,
        process.env.FolderName,
      );

      // Update video URL and delete old video
      if (uploadDetails) {
        subsection.videoUrl = uploadDetails.secure_url;
        await deleteCloudinaryVideo(oldVideoUrl);
      }
    }

    if (!tittle && !description && !uploadDetails) {
      return res.status(400).json({
        success: false,
        message: "Kindly Enter something in the Field",
      });
    }

    if (tittle) subsection.tittle = tittle;
    if (description) subsection.description = description;

    await subsection.save();

    const UpdatedData = await Section.findOne({
      subsection: SubsectionId,
    }).populate("subsection");

    console.log("The updation data is ", UpdatedData);

    return res.status(200).json({
      success: true,
      message: "Successfully Updated The data",
      updatedSection: UpdatedData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
