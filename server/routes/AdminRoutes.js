const {
  InsightData,
  InstructorData,
  UserMangment,
  CourseManagment,
  chartMangment,
  getTopCourses,
  statusUpgrade,
  toggleCourseStatus,
  adminDeleteCourse,
  getStudentPerformanceAnalytics,
} = require("../controllers/Admin");
const express = require("express");
const { admin, auth } = require("../middlewares/auth");
const { cacheMiddleware } = require("../middlewares/Caching");
const router = express.Router();

// Insights
router.get("/auth/admin/insight", auth, admin, InsightData);

// Instructor Data (auth & admin BEFORE cacheMiddleware)
router.get(
  "/auth/admin/instructors",
  auth,
  admin,
  cacheMiddleware((req) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 5;
    const search = req.query.search || "";
    return `Cache:CourseInstructor:page=${page}:limit=${limit}:search=${search}`;
  }, 60),
  InstructorData,
);

// User Management
router.get("/auth/admin/user-mangment", auth, admin, UserMangment);

// Course Management
router.get("/auth/admin/course-mangment", auth, admin, CourseManagment);
router.get("/auth/admin/course-mangment-trend", auth, admin, chartMangment);
router.get("/admin/charts/top-categories", auth, admin, getTopCourses);

// Status & Moderation Actions
router.patch("/admin/instructors/:id/status", auth, admin, statusUpgrade);
router.patch("/admin/courses/:id/status", auth, admin, toggleCourseStatus);
router.delete("/admin/courses/:id", auth, admin, adminDeleteCourse);
router.get("/admin/students/:id/performance", auth, admin, getStudentPerformanceAnalytics);

module.exports = router;
