const { instance } = require("../config/razerpay");
const Course = require("../models/course");
const User = require("../models/User");
const crypto = require("crypto");
const mailsender = require("../utils/mailpotp");
const { courseEnrollmentEmail } = require("../mail template/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

// Capture the payment & create Razorpay order
exports.capturePayment = async (req, res) => {
  const { course_id } = req.body;
  const userid = req.user.id;

  // Validate course ID
  if (!course_id) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid Course ID",
    });
  }

  let course;
  try {
    course = await Course.findById(course_id);
    if (!course) {
      return res.json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if user is already enrolled
    const uid = new mongoose.Types.ObjectId(userid);
    if (course.studentEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "User is already enrolled",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  // Create Razorpay order
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100,
    currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      course_id,
      userid,
    },
  };

  try {
    const paymentResponse = await instance.orders.create(options);
    console.log(paymentResponse);

    return res.status(200).json({
      success: true,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      order_Id: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      user : req.user.id
    });
  } catch (error) {
    console.log(error);
    return res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

// Verify Razorpay signature & process enrollment
exports.verifySignature = async (req, res) => {
  const webhookSecret = "12345678";
  const signature = req.headers["x-razorpay-signature"];
console.log(signature);
  const sha = crypto.createHmac("sha256", webhookSecret);
  sha.update(JSON.stringify(req.body));
  
console.log("STRINGIFIED BODY:", JSON.stringify(req.body));

  const digest = sha.digest("hex");

  // Verify signature using timing-safe comparison
  if (
    signature &&
    signature.length === digest.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
  ) {
    console.log("Payment is Authorized");

    const { course_id, userid } = req.body.payload.payment.entity.notes;

    try {
      // Add student to course enrollment list
      const enrolledCourse = await Course.findByIdAndUpdate(
        { _id: course_id },
        { $push: { studentEnrolled: userid } },
        { new: true }
      );

      if (!enrolledCourse) {
        return res.status(500).json({
          success: false,
          message: "Course not found",
        });
      }

      // Add course to student profile
      const enrolledStudent = await User.findOneAndUpdate(
        { _id: userid },
        { $push: { courses: course_id } },
        { new: true }
      );

      // Send confirmation email
      const emailResponse = await mailsender(
        enrolledStudent.email,
        "Congratulations!",
        "You have been successfully enrolled in the new CodeHelp course."
      );
      console.log(emailResponse);

      return res.status(200).json({
        success: true,
        message: "Signature verified and course enrollment completed",
      });
    } catch (error) {
      console.log("Error during enrollment:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } else {
    // Signature invalid
    console.log("Invalid signature");
    return res.status(400).json({
      success: false,
      message: "Invalid request signature",
    });
  }
};
