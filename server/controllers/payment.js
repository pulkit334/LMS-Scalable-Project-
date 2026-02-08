const { instance } = require("../config/razerpay");
const Course = require("../models/course");
const User = require("../models/User");
const mongoose = require("mongoose");
const mailsender = require("../utils/mailpotp");
require("dotenv").config();
const crypto = require("crypto");
const Payment = require("../models/payment");
const {
  courseEnrollmentEmail,
} = require("../mail template/courseEnrollmentEmail");
const { PaymentSuccessEmail } = require("../mail template/paymentSuccessEmail");
const payment = require("../models/payment");
const NotificationService = require("../service/notifcaitonservice");
const Notification = require("../models/notification");
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
      initiatedAt: new Date(),
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
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courses,
    } = req.body;

    const userId = req.user.id;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses?.length ||
      !userId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Payment failed" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    const CourseDoc = await Course.find({ _id: { $in: courses } })
      .select("price")
      .lean();

    const PriceMap = new Map(CourseDoc.map((c) => [String(c._id), c.price]));

    const ResponseData = courses.map((courseId) => ({
      user: userId,
      course: courseId,
      price: PriceMap.get(String(courseId)) || 0,
      paymentid: razorpay_payment_id,
      orderid: razorpay_order_id,
      status: "success",
      signature: razorpay_signature,
    }));

    await Payment.insertMany(ResponseData);

    await enrolledStudent(courses, userId, razorpay_order_id);
    //check whteher the user came after the notficaiton we order
    //it is not always possible that user came and checkout the product on behalf of the notifcaiton only  -> let it be unporcessed For now?
  const paymentDoc =  await Payment.findOne({
    user  : userId,
    orderid : razorpay_order_id
  })



    const paymentTwentyFourHourago = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (
      paymentDoc.reminderSent &&
      paymentDoc.reminderSent < paymentTwentyFourHourago
    ) {
      paymentDoc.completedAfterReminder = true;
    }
    await paymentDoc.save();
    const user = await User.findById(userId);
    console.log("🔔 Sending payment notification to user:", userId);
console.log("FCM Token:", user?.fcmToken);

    if (user?.fcmToken) {
      await NotificationService.sendNotification(
        "Course Purchased 🎉",
        "You are successfully enrolled in your course. Happy learning!",
        user.fcmToken,
      );
    }


  //Now Save  the Notoificaiton to DB 
    await Notification.create({
      user : userId,
      title : "Course Purchased 🎉",
      body : "You are successfully enrolled in your course. Happy learning!",
      type : "COURSE",
      expiresat : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    })
    return res.status(200).json({
      success: true,
      message: "Payment verified & user enrolled",
    });
  } catch (err) {
    console.error("VerifyPayment error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const enrolledStudent = async (courses, userId, razorpay_order_id) => {
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
        { $addToSet: { OrderId: razorpay_order_id } },
        { new: true, session },
      );

      if (!enrolledCourse) {
        throw new Error("Course not found");
      }

      const enrolledUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { courses: courseId } },
        { new: true, session },
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
        courseEnrollmentEmail(data.courseName, data.firstName),
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
        paymentId,
      ),
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

//
exports.Paymenthistory = async (req, res) => {
  try {
    const userid = req.user.id;
    const history = await Payment.find({ user: userid })
      .populate("course", "courseName thumbnail price")
      .lean();
    if (!history) {
      return res.status(202).json({
        success: true,
        message: "No Course Found",
      });
    }
    return res.status(200).json({
      success: false,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      messsage: "Failed Try Again ",
    });
  }
};
