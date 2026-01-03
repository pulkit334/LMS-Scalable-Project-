const SubSection = require("../models/subsection");
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageuploader");
const course = require("../models/course");

// Create Subsection
// exports.createSubsection = async (req, res) => {
//   try {
//     console.log("The Data is ", req.body);
//     // fetch the data
//     const { sectionId,  timeDuration,tittle, description } = req.body;
//     if (!req.files || Object.keys(req.files).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Video file is required",
//       });
//     }

//     const video = req.files.videoFile;

//     // validation
//     if (!sectionId || !tittle || !timeDuration || !description || !video) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required",
//       });
//     }

//     // upload video to cloudinary
//     const uploadDetails = await uploadImageToCloudinary(
//       video,
//       process.env.FolderName
//     );

//     // create subsection
//     const subsection = await SubSection.create({
//       tittle,
//       timeduration: timeDuration,
//       description,
//       videoUrl: uploadDetails.secure_url,
//     });

//     // update the section with this subsection id

//     const updatedSection = await Section.findByIdAndUpdate(
//       sectionId,
//       {
//         $push: { subsection: subsection._id }, // FIXED
//       },
//       { new: true }
//     ).populate("subsection"); //
// //course should be ud
//     return res.status(200).json({
//       success: true,
//       message: "Subsection created successfully",
//       updatedSection,
//       subsection
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to create subsection",
//       error: err.message,
//     });
//   }
// };
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
      process.env.FolderName
    );

    // create subsection
    const subsection = await SubSection.create({
      tittle,
      timeduration: timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    // update the section with this subsection id
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subsection: subsection._id },
      },
      { new: true }
    ).populate("subsection");

    /* ================= COURSE DURATION UPDATE ================= */

    const section = await Section.findById(sectionId);
// 🔍 DEBUG LOGS (ADD THESE)
console.log("SECTION ID:", sectionId)
console.log("SECTION DOC:", section);
console.log("SECTION COURSE ID:", section?.courseId);
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
      updatedSection,
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
      "tittle timeduration description vediourl"
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
    if (!tittle && !description) {
      return res.status(403).json({
        success: true,
        message: "Kindly Enter something in the Feild",
      });
    }

    subsection.tittle = tittle;
    subsection.description = description;
    await subsection.save();
    return res.status(201).json({
      success: true,
      message: "Succesfully Updated The data",
    });
  } catch (error) {
    return res.status(400).json({
      success: true,
      message: error.message,
    });
  }
};
