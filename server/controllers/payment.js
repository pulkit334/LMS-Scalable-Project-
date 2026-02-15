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
const NotificationService = require("../service/notifcaitonservice");
const Notification = require("../models/notification");

exports.CapturePayment = async (req, res) => {
  try {
    const { courses } = req.body; // expect array of courseIds
    const userId = req.user.id;

    // Validation
    if (!courses || courses.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide course IDs",
      });
    }

    let totalAmount = 0;
    const courseThumbnails = []; //  Store all course thumbnails
    const courseDetails = []; //  Store course details
    const uid = new mongoose.Types.ObjectId(userId);

    // Loop through courses
    for (const courseId of courses) {
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }

      // Check already enrolled
      if (course.studentEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: `Already enrolled in ${course.courseName}`,
        });
      }

      totalAmount += course.price;

      //  Collect course thumbnails and details
      if (course.thumbnail) {
        courseThumbnails.push(course.thumbnail);
      }

      courseDetails.push({
        id: course._id,
        name: course.courseName,
        thumbnail: course.thumbnail,
        price: course.price,
      });
    }

    console.log(" Payment Courses:", courses);
    console.log(" Course Thumbnails:", courseThumbnails);

    // Razorpay order
    const options = {
      amount: totalAmount * 100, // paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        courses: courses.join(","),
        userId,
        //  Store first course thumbnail (Razorpay notes have size limits)
        thumbnail: courseThumbnails[0] || "",
      },
    };

    const paymentResponse = await instance.orders.create(options);
    console.log(" Payment Response:", paymentResponse);

    return res.status(200).json({
      success: true,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
      data: paymentResponse,
      //  Send course details including thumbnails
      courseDetails: courseDetails,
      thumbnail: courseThumbnails[0], //  First course thumbnail for display
      thumbnails: courseThumbnails, //  All thumbnails
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

// Payment Verification
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
        .json({ success: false, message: "Payment failed - Missing fields" });
    }

    // Verify signature
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

    //Fetch course details WITH thumbnails
    const CourseDoc = await Course.find({ _id: { $in: courses } })
      .select("price courseName thumbnail") //  Include thumbnail
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

    // Check reminder completion
    const paymentDoc = await Payment.findOne({
      user: userId,
      orderid: razorpay_order_id,
    });

    const paymentTwentyFourHourago = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (
      paymentDoc?.reminderSent &&
      paymentDoc.reminderSent < paymentTwentyFourHourago
    ) {
      paymentDoc.completedAfterReminder = true;
      await paymentDoc.save();
    }

    const user = await User.findById(userId);

    //  Prepare notification details
    const courseNames = CourseDoc.map((c) => c.courseName).join(", ");
    const courseThumbnail = CourseDoc[0]?.thumbnail || null; //  Use first course thumbnail

    const notificationTitle = "Course Purchased 🎉";
    const notificationBody =
      courses.length > 1
        ? `You are successfully enrolled in ${courses.length} courses. Happy learning!`
        : `You are successfully enrolled in ${courseNames}. Happy learning!`;

    //  Send notification with course thumbnail
    if (user?.fcmToken) {
      try {
        const notificationResult =
          await NotificationService.sendMultipleNotification(
            notificationTitle,
            notificationBody,
            user.fcmToken,
            courseThumbnail, //  Pass course thumbnail, not user thumbnail
          );

        // Handle invalid token
        if (notificationResult?.shouldRemoveToken) {
          await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        }
      } catch (notificationError) {
        // Remove invalid token
        if (
          notificationError.code ===
            "messaging/registration-token-not-registered" ||
          notificationError.code === "messaging/invalid-registration-token"
        ) {
          await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        }
      }
    }
    //  Save notification to DB with course thumbnail
    await Notification.create({
      user: userId,
      title: notificationTitle,
      body: notificationBody,
      type: "COURSE",
      image: courseThumbnail, //
      metadata: {
        courses: courses,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      },
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified & user enrolled",
      data: {
        courses: CourseDoc.map((c) => ({
          id: c._id,
          name: c.courseName,
          thumbnail: c.thumbnail,
        })),
      },
    });
  } catch (err) {
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
        {
          $addToSet: {
            studentEnrolled: userId,
            OrderId: razorpay_order_id,
          },
        },
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

      // Collect email data
      emailQueue.push({
        email: enrolledUser.email,
        firstName: enrolledUser.firstName,
        courseName: enrolledCourse.courseName,
      });
    }

    // COMMIT DB CHANGES
    await session.commitTransaction();
    session.endSession();

    // SEND EMAILS AFTER COMMIT
    const emailResult = await Promise.allSettled(
      emailQueue.map((data) =>
        mailsender(
          data.email,
          `Successfully enrolled in ${data.courseName}`,
          courseEnrollmentEmail(data.courseName, data.firstName),
        ),
      ),
    );

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
    console.log("Error sending email:", error);
    return res.status(500).json({
      success: false,
      message: "Could Not Send Email",
    });
  }
};

exports.Paymenthistory = async (req, res) => {
  try {
    const userid = req.user.id;
    const history = await Payment.find({ user: userid })
      .populate("course", "courseName thumbnail price")
      .lean();

    if (!history || history.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Course Found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed Try Again",
    });
  }
};
