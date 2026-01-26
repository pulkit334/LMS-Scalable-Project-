const {
  InsightData,
  InstructorData,
  UserMangment,
  CourseManagment,
  chartMangment,
} = require("../controllers/Admin");
const express = require("express");
const { admin, auth } = require("../middlewares/auth");
const { cacheMiddleware } = require("../middlewares/Caching");
const router = express.Router();

//Insights
router.get("/auth/admin/insight", auth, admin, InsightData);
//Instrcutor Data
router.get(
  "/auth/admin/instructors",
  cacheMiddleware(
    (req) => {
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const search = req.query.search || "";

      return `Cache:CourseInstructor:page=${page}:limit=${limit}:search=${search}`;
    },
    50,
  ),
  auth,
  admin,
  InstructorData,
);

//User Data
router.get("/auth/admin/user-mangment", auth, admin, UserMangment);
//Course Mangment
router.get("/auth/admin/course-mangment", auth, admin, CourseManagment);
//Course Mangement Data
router.get("/auth/admin/course-mangment-trend", auth, admin, chartMangment);
module.exports = router;
