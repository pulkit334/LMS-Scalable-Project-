const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      const headerToken = req.headers.authorization.split(" ")[1]?.trim();
      if (headerToken && headerToken !== "null" && headerToken !== "undefined") {
        token = headerToken;
      }
    }

    if (!token && req.cookies?.token) {
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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: "ACCESS_TOKEN_EXPIRED",
      error: err.message,
    });
  }
};

async function resolveNormalizedRole(req) {
  const tokenRole = String(req.user?.accountType || "").trim().toLowerCase();
  if (tokenRole) return tokenRole;

  if (req.user?.id) {
    const dbUser = await User.findById(req.user.id).select("accountType").lean();
    if (dbUser?.accountType) {
      req.user.accountType = dbUser.accountType;
      return String(dbUser.accountType).trim().toLowerCase();
    }
  }
  return "";
}

// isstudent
exports.isstudent = async (req, res, next) => {
  try {
    let role = await resolveNormalizedRole(req);
    if (role !== "student" && req.user?.id) {
      const dbUser = await User.findById(req.user.id).select("accountType").lean();
      if (dbUser?.accountType) {
        req.user.accountType = dbUser.accountType;
        role = String(dbUser.accountType).trim().toLowerCase();
      }
    }
    if (role !== "student") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route only for students",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};

// isinstructor
exports.isinstructor = async (req, res, next) => {
  try {
    let role = await resolveNormalizedRole(req);
    if (role !== "instructor" && req.user?.id) {
      const dbUser = await User.findById(req.user.id).select("accountType").lean();
      if (dbUser?.accountType) {
        req.user.accountType = dbUser.accountType;
        role = String(dbUser.accountType).trim().toLowerCase();
      }
    }
    if (role !== "instructor") {
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

// isadmin
exports.admin = async (req, res, next) => {
  try {
    let role = await resolveNormalizedRole(req);
    if (role !== "admin" && req.user?.id) {
      const dbUser = await User.findById(req.user.id).select("accountType").lean();
      if (dbUser?.accountType) {
        req.user.accountType = dbUser.accountType;
        role = String(dbUser.accountType).trim().toLowerCase();
      }
    }
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "This is a protected route only for admins",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    });
  }
};
