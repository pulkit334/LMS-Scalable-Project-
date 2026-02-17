const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");


exports.auth = async (req, res, next) => {
  try {
let token = null;

if (req.headers.authorization) {
  token = req.headers.authorization.split(" ")[1];
} else {
  token = req.cookies.token;
}


    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
        code: "ACCESS_TOKEN_MISSING",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("auth error:", err.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: "ACCESS_TOKEN_EXPIRED",
      error: err.message,
    });
  }
};


//isstudent
exports.isstudent = async (req, res, next) => {
  try {
    if (req.user.accountType != "student") {
      return res.status(401).json({
        success: false,
        message: "This is Protected Route only for student",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role Cannot Be Verified",
    });
  }
};

//isinstrutor
exports.isinstructor = async (req, res, next) => {
  try {
    console.log("middleware user:", req.user);

    if (req.user.accountType !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors are allowed to access this route",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
      error: err.message,
    });
  }
};

//isadmin

exports.admin = async (req, res, next) => {
  try {
    if (req.user.accountType != "admin") {
      return res.status(401).json({
        success: false,
        message: "This is Protected Route only for isadmin",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role Cannot Be Verified",
    });
  }
};
