const profile = require("../models/profile");
const User = require("../models/User");
const Course = require("../models/course")
const recoveryEmailTemplate = require("../utils/emailTemplates");
const mailsender = require("../utils/mailpotp");
const { uploadImageToCloudinary } = require("../utils/imageuploader");
const Cloudinary = require("cloudinary").v2;
const crypto = require("crypto");
exports.UpdateProfile = async (req, res) => {
  try {
    console.log("hey ther updated successfully");
    const userId = req.user.id;

    const allowedFields = [
      "dateofBirth",
      "about",
      "contactNumber",
      "gender",
      "firstName",
      "lastName",
    ];

    // get user
    const user = await User.findById(userId).select("additionalDetails");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // get profile
    const profileDetails = await profile.findById(user.additionalDetails);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    // PATCH update dynamically
    let updated = false;
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profileDetails[field] = req.body[field];
        updated = true;
      }
    });

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: err.message,
    });
  }
};

//deleteAccount
exports.deleteAccount = async (req, res) => {
  try {
    //get the id
    const id = req.user.id;
    //valdiate the id
    const userdetails = await User.findById(id);
    if (!userdetails) {
      return res.status(404).json({
        success: false,
        message: "user Not Found",
      });
    }
    await User.findByIdAndUpdate(id, {
      deleteRequestedAt: new Date(),
      isdeleted: true,
    });
    await mailsender(
      userdetails.email,
      "Account Deleted - StudyNotion",
      "Your account will be Delete After 2hr..."
    );
    ////////
    //how we can scheled the job scheduling mens task sechdule
    //crone job
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res.status(200).json({
      success: true,
      message: "After 2hr Your Account Will Be deactivated....",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "successfully deleted..",
      error: err.message,
    });
  }
};

exports.UndoAccount = async (req, res) => {
  try {
    const { email } = req.body;

    const validate = await User.findOne({ email });
    if (!validate || !validate.isdeleted) {
      return res.status(404).json({
        success: false,
        message: "Nothing To Undo Try Again After 24hr....",
      });
    }

    const TWO_HOURS = 2 * 60 * 60 * 1000;
    if (Date.now() - validate.deleteRequestedAt > TWO_HOURS) {
      return res.status(403).json({
        success: false,
        message: "Sorry, The Session Window Is Expired",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    validate.recoveryToken = hashedToken;
    validate.recoveryTokenExpires = Date.now() + 15 * 60 * 1000;

    // validate.isdeleted = false;
    // validate.deleteRequestedAt = null;

    await validate.save();

    const RecoveryLink = `${process.env.FRONTEND_URL}recover-account/${token}`;
    await mailsender(
      validate.email,
      "Account Recoverying - StudyNotion",
      recoveryEmailTemplate(RecoveryLink)
    );

    return res.status(200).json({
      success: true,
      message: "Recovery email sent. Please check your inbox.",
    });
  } catch (err) {
    console.log("the erroro hitted", err);
    return res.sta;
  }
};

exports.getAllUserDetiles = async (req, res) => {
  try {
    //get the id
    //get user deatils and validate
    //return resposne
    const id = req.user.id;
    const userdetails = await User.findById(id)
      .populate("additionalDetails")
      .populate({
        path: "courses",
        populate: {
          path: "ratingAndReviews", // schema field
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "User data Fetched...",
      userdetails,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      err: err.message,
    });
  }
};

// update profile photo
exports.UpdateProfilePhoto = async (req, res) => {
  try {
    const file = req?.files?.image;
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    // 1. get user
    const user = await User.findById(req.user.id);

    // 2. delete old image if exists
    if (user?.image?.publicId) {
      await Cloudinary.uploader.destroy(user.image.publicId);
    }

    // 3. upload new image
    const uploadedImage = await uploadImageToCloudinary(file, "Profile-image");

    // 4. ensure image object exists
    if (!user.image) {
      user.image = {};
    }
    console.log("updating the file  New one ", uploadedImage);
    // now safe to set
    user.set("image", {
      url: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });

    await user.save();

    // 5. response
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      image: user.image.url,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.verifyAccountRecovery = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({
        success: false,
        code: "TOKEN_MISSING",
        message: "Recovery link is invalid.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      recoveryToken: hashedToken,
      recoveryTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        code: "INVALID_OR_EXPIRED_TOKEN",
        message: "This recovery link has expired or is invalid.",
      });
    }
    user.isdeleted = false;
    user.deleteRequestedAt = null;
    user.recoveryToken = undefined;
    user.recoveryTokenExpires = undefined;

    user.save();
    return res.status(200).json({
      success: true,
      code: "ACCOUNT_RECOVERED",
      message: "Your account has been successfully reactivated.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again later.",
    });
  }
};
//DAta 
exports.InstructorDashboard = async (req,res)=>{
  try {
const CourseDeatails = await Course.find({Insturctor : req.user.id});
const courseData  = CourseDeatails.map((course)=>{
  const totalStudentEnrolled = course.studentEnrolled.length || []
  const totalAmount = totalStudentEnrolled * course.price
  //create a abject with adddtional details
  const courseDataWithStats = {
    _id : course._id,
    courseName : course.courseName,
    courseDescription : course.courseDescription,
    totalStudentEnrolled,
    totalAmount
  }
  return courseDataWithStats
})
return res.status(200).json({
  success : true,
  courses : courseData
})
  }
  catch(err){
    console.log(err)
    res.status(500).json({
      success : false,
      message : "Internal Server Error"
    })
  }
}