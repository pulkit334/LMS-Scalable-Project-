const User = require("../models/User");
const OTP = require("../models/opt");
const OtpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Profile = require("../models/profile");
const mailsender = require("../utils/mailpotp");
exports.sendOtp = async (req, res) => {
  try {
    console.log(" sendOtp ROUTE HIT");
    console.log("BODY:", req.body);
    console.log("COOKIES:", req.cookies);
    console.log("HEADERS AUTH:", req.headers.authorization);
    //fetch the email from Req Body 
    const { email } = req.body;
    //Check If User alerady exist or Not
    const checkUserpresent = await User.findOne({ email });
    //if user Alerday Exist ,then Return
    if (checkUserpresent) {
      return res.status(409).json({
        success: false,
        message: "The User Already Exists",
      });
    }

    //generate the Otp is not exist
    var otp = OtpGenerator.generate(6, {
      upperCaseAlphabetsL: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    //check uniqe otp  upgradfirstname vare to hasing /////
    //  removed db checking + while loop as not needed

    const Otppayload = { email, otp };
    //create an entry in db for Otp
    const otpBody = await OTP.create(Otppayload);
    console.log(otpBody);
    await mailsender(email, "Your OTP Code", `<h1>Your OTP is: ${otp}</h1>`);
    return res.status(201).json({
      success: true,
      message: "OTP Sent Succesfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Error while Sending Otp ",
    });
  }
};

//sinup
exports.sinup = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const {
      firstName,
      lastName,
      email,
      password,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    console.log(otp);
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !contactNumber ||
      !accountType
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists",
      });
    }

    //  Get latest OTP saved in MongoDB
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });

    if (!recentOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    //  Check OTP
    if (otp !== recentOtp.otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profiledetailed = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });

    await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profiledetailed._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });

    return res.status(201).json({
      success: true,
      message: "Successfully Registered",
    });
  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    return res.status(400).json({
      success: false,
      message: `${err}`,
      error: err,
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    //get the Data from Req Body
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields Are required",
        success: false,
      });
    }

    //check user exist or not

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User does not exist",
      });
    }
    if (user && user.accountType !== role) {
      return res.status(403).json({
        success: false,
        code: "ACCESS_DENIED",
        message: "You do not have permission to access this resource.",
      });
    }
    // check deleted
    if (user.isdeleted) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_DELETED REQUEST IS SUBMITTED",
        message: "Account is disabled",
      });
    }

    //User Check exist or not
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password",
        success: false,
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
      accountType: user.accountType,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    //attach token and remove password
    user.token = token;
    user.password = undefined;

    //create cookie
    const options = {
      httpOnly: true, // cannot access via JS
      secure: process.env.NODE_ENV === "production", // FIXED for localhost
      sameSite: "lax", // prevents CSRF issues
      expires: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
    };

    return res.cookie("token", token, options).status(200).json({
      success: true,
      user,

      message: "Logged in",
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      message: "Authenticatin Failed",
      success: false,
      error: err.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Validate input
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userId = req.user.id;

    // 2. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 3. Check old password
    const isOldPasswordCorrect = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isOldPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    // 4. Prevent same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from old password",
      });
    }

    // 5. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 6. Update DB
    user.password = hashedPassword;
    await user.save();

    // 7. Success response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
    });
  }
};
