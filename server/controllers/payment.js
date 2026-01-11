const { instance } = require("../config/razerpay");
const Course = require("../models/course");
const User = require("../models/User");
const mongoose = require("mongoose");
const mailsender = require("../utils/mailpotp");
require("dotenv").config();
const crypto = require("crypto");

const {
  courseEnrollmentEmail,
} = require("../mail template/courseEnrollmentEmail");
const { PaymentSuccessEmail } = require("../mail template/paymentSuccessEmail");
exports.CapturePayment = async (req, res) => {
  try {
    const { courses } = req.body; // expect array of courseIds
    const userId = req.user.id;

    //  Validation
    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide course IDs",
      });
    }

    let totalAmount = 0;
    const uid = new mongoose.Types.ObjectId(userId);

    //  Loop through courses
    for (const courseId of courses) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      //  Check already enrolled
      if (course.studentEnrolled.includes(uid)) {
        console.log("The Capture Payment Record is", course);
        return res.status(400).json({
          success: false,
          message: `Already enrolled in ${course}`,
        });
      }

      totalAmount += course.price;
    }

    //  Razorpay order
    const options = {
      amount: totalAmount * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courses: courses.join(","),
        userId,
      },
    };

    const paymentResponse = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      data: paymentResponse,
    });
  } catch (error) {
    console.error("CapturePayment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment capture failed",
    });
  }
};
// /payment Verifciaiton
exports.VerifyPayment = async (req, res) => {
  try {
    const razorpay_order_id = req.body.razorpay_order_id;
    const razorpay_payment_id = req.body.razorpay_payment_id;
    const razorpay_signature = req.body.razorpay_signature;
    const courses = req.body.courses;
    const userId = req.user.id;

    console.log("VerifyPayment details:", {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
      userId,
    });

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses?.length ||
      !userId
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      //ennrooll\
      await enrolledStudent(courses, userId);

      return res.status(200).json({
        success: true,
        message: "Payment verified & user enrolled",
      });
    }
  } catch (err) {
    console.error("VerifyPayment error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const enrolledStudent = async (courses, userId) => {
  if (!courses?.length || !userId) {
    throw new Error("Missing courses or userId");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const emailQueue = [];

  try {
    for (const courseId of courses) {
      const enrolledCourse = await Course.findByIdAndUpdate(
        courseId,
        { $addToSet: { studentEnrolled: userId } },
        { new: true, session }
      );

      if (!enrolledCourse) {
        throw new Error("Course not found");
      }

      const enrolledUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { courses: courseId } },
        { new: true, session }
      );

      if (!enrolledUser) {
        throw new Error("User not found");
      }

      // collect email data 
      emailQueue.push({
        email: enrolledUser.email,
        firstName: enrolledUser.firstName,
        courseName: enrolledCourse.courseName,
      });
    }

    // COMMIT DB CHANGES
    await session.commitTransaction();
    session.endSession();

    // \SEND EMAILS AFTER COMMIT
    for (const data of emailQueue) {
      await mailsender(
        data.email,
        `Successfully enrolled in ${data.courseName}`,
        courseEnrollmentEmail(data.courseName, data.firstName)
      );
    }

    return true;
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

// work well for single Order s//
// Capture the payment & create Razorpay order
// exports.capturePayment = async (req, res) => {
//   const { course_id } = req.body;
//   const userid = req.user.id;

//   // Validate course ID
//   if (!course_id) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide a valid Course ID",
//     });
//   }

//   let course;
//   try {
//     course = await Course.findById(course_id);
//     if (!course) {
//       return res.json({
//         success: false,
//         message: "Course not found",
//       });
//     }

//     // Check if user is already enrolled
//     const uid = new mongoose.Types.ObjectId(userid);
//     if (course.studentEnrolled.includes(uid)) {
//       return res.status(200).json({
//         success: false,
//         message: "User is already enrolled",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

//   // Create Razorpay order
//   const amount = course.price;
//   const currency = "INR";

//   const options = {
//     amount: amount * 100,
//     currency,
//     receipt: Math.random(Date.now()).toString(),
//     notes: {
//       course_id,
//       userid,
//     },
//   };

//   try {
//     const paymentResponse = await instance.orders.create(options);
//     console.log(paymentResponse);

//     return res.status(200).json({
//       success: true,
//       courseName: course.courseName,
//       courseDescription: course.courseDescription,
//       thumbnail: course.thumbnail,
//       order_Id: paymentResponse.id,
//       currency: paymentResponse.currency,
//       amount: paymentResponse.amount,
//       user : req.user.id
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(402).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Verify Razorpay signature & process enrollment
// exports.verifySignature = async (req, res) => {
//   const webhookSecret = "12345678";
//   const signature = req.headers["x-razorpay-signature"];
// console.log(signature);
//   const sha = crypto.createHmac("sha256", webhookSecret);
//   sha.update(JSON.stringify(req.body));

// console.log("STRINGIFIED BODY:", JSON.stringify(req.body));

//   const digest = sha.digest("hex");

//   // Verify signature using timing-safe comparison
//   if (
//     signature &&
//     signature.length === digest.length &&
//     crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
//   ) {
//     console.log("Payment is Authorized");

//     const { course_id, userid } = req.body.payload.payment.entity.notes;

//     try {
//       // Add student to course enrollment list
//       const enrolledCourse = await Course.findByIdAndUpdate(
//         { _id: course_id },
//         { $push: { studentEnrolled: userid } },
//         { new: true }
//       );

//       if (!enrolledCourse) {
//         return res.status(500).json({
//           success: false,
//           message: "Course not found",
//         });
//       }

//       // Add course to student profile
//       const enrolledStudent = await User.findOneAndUpdate(
//         { _id: userid },
//         { $push: { courses: course_id } },
//         { new: true }
//       );

//       // Send confirmation email
//       const emailResponse = await mailsender(
//         enrolledStudent.email,
//         "Congratulations!",
//         "You have been successfully enrolled in the new CodeHelp course."
//       );
//       console.log(emailResponse);

//       return res.status(200).json({
//         success: true,
//         message: "Signature verified and course enrollment completed",
//       });
//     } catch (error) {
//       console.log("Error during enrollment:", error);
//       return res.status(500).json({
//         success: false,
//         message: error.message,
//       });
//     }
//   } else {
//     // Signature invalid
//     console.log("Invalid signature");
//     return res.status(400).json({
//       success: false,
//       message: "Invalid request signature",
//     });
//   }
// };
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;
  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide All the Fields",
    });
  }
  try {
    const enrolledStudent = await User.findById(userId);
    await mailsender(
      enrolledStudent.email,
      "Payment Successful",
      PaymentSuccessEmail(
        enrolledStudent.firstName,
        amount / 100,
        orderId,
        paymentId
      )
    );

    return res.status(200).json({
      success: true,
      message: "Payment success email sent",
    });
  } catch (error) {
    console.log("teh error is ", error);
    return res.status(500).json({
      success: false,
      message: "Could Not Send Email",
    });
  }
};
