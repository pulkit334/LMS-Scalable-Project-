const Razerpay = require("razorpay");
require("dotenv").config();
exports.instance = new Razerpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
