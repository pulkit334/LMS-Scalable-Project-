const SubSection = require("../models/subsection");
const Section = require("../models/section");
const { uploadImageToCloudinary } = require("../utils/imageuploader");
const cloudinary = require("../utils/cloudinaryupload");
const course = require("../models/course");
const Transcript = require("../models/transcription");
const Question = require("../models/questionModal");
const { transcriptionQueue } = require("../service/transcription-queue-service");
const redisClient = require("../Reddis/client");

exports.createSubsection = async (req, res) => {
  try {
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
      cloudinaryId: uploadDetails.public_id,
      status: "TRANSCRIBING",
      notesStatus: "pending",
      videoUrl: uploadDetails.secure_url,
    });

    // Queue transcription immediately so it works both locally and in production
    try {
      await transcriptionQueue.add(
        "transcribe",
        {
          subsectionId: String(subsection._id),
          cloudinaryUrl: uploadDetails.secure_url,
          cloudinaryId: uploadDetails.public_id,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 4000 },
        }
      );
    } catch (queueErr) {
      console.error("[createSubsection] Failed to queue transcription:", queueErr.message);
      await SubSection.findByIdAndUpdate(subsection._id, {
        status: "UPLOADED",
        notesStatus: null,
      });
    }

    // update the section with this subsection id
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: { subsection: subsection._id },
      },
      { new: true }
    ).populate("subsection");

    /* ================= COURSE DURATION UPDATE ================= */

    const section = await Section.findById(sectionId);

    if (section?.courseId) {
      const courseDoc = await course.findById(section.courseId).populate({
        path: "courseContent",
        populate: { path: "subsection" },
      });

      if (courseDoc) {
        let totalSeconds = 0;

        courseDoc.courseContent.forEach((sec) => {
          sec.subsection.forEach((lec) => {
            totalSeconds += Number(lec.timeduration) || 0;
          });
        });

        courseDoc.totalDuration = `${Math.ceil(totalSeconds / 60)} mins`;
        await courseDoc.save();
      }
    }

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

    const data = await SubSection.findById(subSectionId).select(
      "tittle timeduration description videoUrl status notesStatus"
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

// Subsection Update
const deleteCloudinaryVideo = async (videoUrl) => {
  if (!videoUrl) return;

  try {
    const parts = videoUrl.split("/upload/")[1];
    if (!parts) {
      console.warn("Invalid Cloudinary URL format:", videoUrl);
      return;
    }

    const pathSegments = parts.split("/");
    const publicId = pathSegments
      .slice(1)
      .join("/")
      .replace(/\.[^/.]+$/, "");

    if (!publicId) {
      console.warn("Could not extract public_id");
      return;
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });

    if (result.result !== "ok") {
      console.warn("Deletion result:", result);
    }
  } catch (error) {
    console.error("Cloudinary deletion failed:", {
      error: error.message,
      url: videoUrl,
    });
  }
};

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
      uploadDetails = await uploadImageToCloudinary(
        vedio,
        process.env.FolderName
      );

      // Update video URL, delete old video, and reset AI artifacts
      if (uploadDetails) {
        subsection.videoUrl = uploadDetails.secure_url;
        subsection.cloudinaryId = uploadDetails.public_id;
        subsection.status = "TRANSCRIBING";
        subsection.notesStatus = "pending";
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

    if (uploadDetails) {
      // Clear stale transcript, questions, and Redis caches, then re-transcribe
      await Promise.all([
        Transcript.deleteMany({ subsectionId: SubsectionId }),
        Question.deleteMany({ subsectionId: SubsectionId }),
        redisClient.del(`questions:${SubsectionId}`, `notes:${SubsectionId}`).catch(() => {}),
      ]);

      await transcriptionQueue.add(
        "transcribe",
        {
          subsectionId: String(subsection._id),
          cloudinaryUrl: uploadDetails.secure_url,
          cloudinaryId: uploadDetails.public_id,
        },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 4000 },
        }
      );
    }

    const UpdatedData = await Section.findOne({
      subsection: SubsectionId,
    }).populate("subsection");

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
