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