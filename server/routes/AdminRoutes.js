const { InsightData, InstructorData ,UserMangment,CourseManagment,chartMangment } = require("../controllers/Admin");
const express = require("express");
const { admin, auth } = require("../middlewares/auth");
const router = express.Router();

//Insights
router.get("/auth/admin/insight", auth, admin, InsightData);
//Instrcutor Data
router.get("/auth/admin/instructors", auth, admin, InstructorData);
//User Data
router.get("/auth/admin/user-mangment",auth,admin,UserMangment)
//Course Mangment 
router.get("/auth/admin/course-mangment",auth,admin,CourseManagment)
//Course Mangement Data 
router.get("/auth/admin/course-mangment-trend",auth,admin,chartMangment )
module.exports = router;
