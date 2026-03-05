const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// exports.auth = async (req, res, next) => {
//   try {
//     //extract token
//     const token = req.cookies.token;

//     //if token is missing
//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Access denied check auth",
//       });
//     }
//     //vefiy the token
//     try {
//       const decode = jwt.verify(token, process.env.JWT_SECRET);
//       console.log("DECODE RESULT:", decode);

//       req.user = decode;
//     } catch (err) {
//       return res.status(401).json({
//         success: false,
//         message: "failed to Login auth",
//       });
//     }
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Something Hell Happend in token",
//     });
//   }
// };
exports.auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // VERY IMPORTANT

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
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
