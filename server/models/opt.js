const mongoose = require("mongoose");
const mailsender = require("../utils/mailpotp");
const OTPSCHEMA = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
    index: true,
  },
});

async function sendverification(email, otp) {
  try {
    const mailResponse = await mailsender(
      email,
      "Verification mail Form StudyNotio",
      otp
    );
} catch (error) {
throw error;
  }
}

OTPSCHEMA.pre("save", async function () {
  try {
    await sendverification(this.email, this.otp);
  } catch (err) {
}
});

module.exports = mongoose.model("OTP", OTPSCHEMA);
// const mongoose = require("mongoose");
// const mailsender = require("../utils/mailpotp");

// const OTPSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//   },
//   otp: {
//     type: String,
//     required: true,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//     expires: 5 * 60, // auto delete in 5 min
//   },
// });

// async function sendVerification(email, otp) {
//   try {
//     await mailsender(email, "Email Verification - StudyNotion", `Your OTP is: ${otp}`);
//     console.log("OTP email sent successfully");
//   } catch (err) {
//     console.log("Error sending OTP email", err);
//     throw err;
//   }
// }

// OTPSchema.pre("save", async function (next) {
//   await sendVerification(this.email, this.otp);
//   next();
// });

// module.exports = mongoose.model("OTP", OTPSchema);
