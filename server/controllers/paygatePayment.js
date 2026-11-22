const axios = require("axios");
const Course = require("../models/course");
const User = require("../models/User");
const Payment = require("../models/payment");
const mongoose = require("mongoose");
const mailsender = require("../utils/mailpotp");
const {
  courseEnrollmentEmail,
} = require("../mail template/courseEnrollmentEmail");

const PAYGATE_URL = process.env.PAYGATE_URL || "http://localhost:6283";
const PAYGATE_API_KEY = process.env.PAYGATE_API_KEY;

// Proxy: Create order via PayGate
exports.paygateCreateOrder = async (req, res) => {
  try {
    const { amount, currency, metadata } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: "Invalid amount" });
    }

    const response = await axios.post(
      `${PAYGATE_URL}/api/v2/payment/create`,
      {
        amount,
        currency: currency || "INR",
        customerName: req.user?.name || "Customer",
        customerEmail: req.user?.email || "customer@example.com",
        metadata: metadata || {},
        idempotencyKey: `lms_${Date.now()}_${req.user?.id || "anon"}`,
      },
      {
        headers: {
          "x-api-key": PAYGATE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "PayGate order creation failed");
    }

    res.status(200).json({
      orderId: response.data.orderId,
      razorpayKey: response.data.razorkey,
      amount: response.data.amount,
      currency: response.data.currency,
    });
  } catch (error) {
    console.error("PayGate Create Order Error:", error.message);
    console.error("PayGate Full Error:", JSON.stringify(error.response?.data || error, null, 2));
    console.error("PayGate Status:", error.response?.status);
    console.error("PayGate URL:", `${PAYGATE_URL}/api/v2/payment/create`);
    console.error("API Key:", PAYGATE_API_KEY ? PAYGATE_API_KEY.substring(0, 20) + "..." : "UNDEFINED");
    res.status(500).json({
      error: error.response?.data?.error || error.message,
    });
  }
};

// Proxy: Verify payment via PayGate
exports.paygateVerifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing payment details" });
    }

    const response = await axios.post(
      `${PAYGATE_URL}/api/v2/payment/verify`,
      {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
      {
        headers: {
          "x-api-key": PAYGATE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Payment verification failed");
    }

    res.status(200).json({
      success: true,
      transactionId: response.data.transactionId || razorpay_payment_id,
    });
  } catch (error) {
    console.error("PayGate Verify Error:", error.message);
    res.status(500).json({
      error: error.response?.data?.error || error.message,
    });
  }
};

// Enroll student in courses (called after PayGate payment success)
exports.paygateEnrollStudent = async (req, res) => {
  try {
    const { courses, razorpay_order_id, razorpay_payment_id } = req.body;
    const userId = req.user.id;

    if (!courses || courses.length === 0) {
      return res.status(400).json({ success: false, message: "No courses provided" });
    }

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
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
          { new: true, session }
        );

        if (!enrolledCourse) {
          throw new Error(`Course not found: ${courseId}`);
        }

        const enrolledUser = await User.findByIdAndUpdate(
          userId,
          { $addToSet: { courses: courseId } },
          { new: true, session }
        );

        if (!enrolledUser) {
          throw new Error(`User not found: ${userId}`);
        }

        emailQueue.push({
          email: enrolledUser.email,
          firstName: enrolledUser.firstName,
          courseName: enrolledCourse.courseName,
        });
      }

      await Payment.create(
        courses.map((courseId) => ({
          user: userId,
          course: courseId,
          paymentid: razorpay_payment_id,
          orderid: razorpay_order_id,
          signature: "paygate_verified",
          status: "success",
          initiatedAt: new Date(),
        })),
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      await Promise.allSettled(
        emailQueue.map((data) =>
          mailsender(
            data.email,
            `Successfully enrolled in ${data.courseName}`,
            courseEnrollmentEmail(data.courseName, data.firstName)
          )
        )
      );

      res.status(200).json({ success: true, message: "Enrollment successful" });
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      throw error;
    }
  } catch (error) {
    console.error("PayGate Enrollment Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PayGate webhook handler
exports.paygateWebhook = async (req, res) => {
  try {
    const { event, data } = req.body;
    console.log("PayGate webhook received:", event, data);
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("PayGate Webhook Error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};
