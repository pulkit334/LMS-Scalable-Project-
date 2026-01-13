const express = require("express");
const router = express.Router();
const { auth, isinstructor, isstudent, admin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
const passport = require("passport");
//************** for Authentication **************//
const {
  sendOtp,
  sinup,
  login,
  changePassword,
} = require("../controllers/Auth");

const { resetpasswordtoken, resetPassword } = require("../controllers/reset");

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
// Google callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173/google-auth?token=${token}`);
  }
);
//***************for courses****************//
const {
  createCourse,
  ShowCourses, // get course details
  getEnrolledCourses,
  changestatus,
  getFullCourseDetails,
  updateCourse,
  deleteCourse,
  getCourse,
  getPaymentCourseReviews,
  getCourseContent,
  markLectureComplete,
} = require("../controllers/Course");

//************for Courses -> section*************//
const {
  createSection,
  updateSection,
  deleteSection,
  section, // get section details
} = require("../controllers/Section");

//************for Courses -> section -> subsection*************//
const {
  createSubsection,
  subsection, // get subsection details
  UpdateSubsection, // Modfiy the subsection
} = require("../controllers/subsection");

//************ Category Api's********************/
const {
  Category,
  AllCategory,
  CategoryPageDetails,
} = require("../controllers/category");

//************ Profile Api's *********************/
const {
  UpdateProfile,
  getAllUserDetiles,
  UndoAccount,
  UpdateProfilePhoto,
  deleteAccount,
  verifyAccountRecovery,
} = require("../controllers/Profile");
//***********************Rating and Reviews ***********//
const {
  createRating,
  getAverageRating,
  getCourseReviews,
  getAllRatingReviews,
} = require("../controllers/rating_review");

//****************Form Contact Helper *********** */
const { submitContactForm } = require("../controllers/contactform");

//*************** Basic payment Gateways Attached ***************
const {
  CapturePayment,
  enrolledStudent,
  VerifyPayment,
  sendPaymentSuccessEmail,
} = require("../controllers/payment");

// ================= PUBLIC AUTH ROUTES =================
router.post("/auth/send-otp", sendOtp);
router.post("/auth/signup", sinup);
router.post("/auth/login", login);
router.post("/auth/reset-password-token", resetpasswordtoken);
router.post("/auth/reset-password", resetPassword);

// ================= PROTECTED AUTH ROUTES =================
router.post("/auth/change-password", auth, changePassword);

// ================= COURSE ROUTES =================

// Public
router.get("/courses", auth, isinstructor, ShowCourses);
//Protected
router.get("/enrolled-courses", auth, getEnrolledCourses);
router.post("/publish-courses", auth, changestatus);
// Protected
router.patch("/course/update/:courseId", auth, isinstructor, updateCourse);

//Payment Course Loader
router.get("/course/:courseId", auth, isstudent, getCourse);
router.get("/course/:courseId/content", auth, isstudent, getCourseContent);
router.get("/course/:courseId/reviews", auth, getPaymentCourseReviews);

router.get("/getFullCourseDetails/:courseId", auth, getFullCourseDetails);
// routes/course.js
router.delete("/course/:courseId", auth, isinstructor, deleteCourse);

//COurse progress
router.post(
  "/course/updateCourseProgress",
  auth,
  isstudent,
  markLectureComplete
);

// ================= SECTION ROUTES =================

// Protected
router.post("/course/create", auth, isinstructor, createCourse);
router.put("/section/update", isinstructor, updateSection);
router.delete("/section/delete/:sectionId", auth, deleteSection, deleteSection);

// GET SECTION
router.get("/section/:sectionId", auth, section);
router.post("/section/create", auth, createSection);

// ================= SUBSECTION ROUTES =================

// Protected
router.post("/subsection/create", auth, isinstructor, createSubsection);

// GET SUBSECTION
router.get("/subsection/:subSectionId", auth, isinstructor, subsection);
//modifying Subsection
router.patch("/subsection/:subSectionId", auth, isinstructor, UpdateSubsection);
// ================= CATEGORY ROUTES =================

// Protected (create)
router.post("/category/create", auth, Category);

// Public (all categories)
router.get("/category/all", auth, AllCategory);
router.post("/course/getCategoryPageDetails", auth, CategoryPageDetails);

// ================= PROFILE ROUTES =================
router.patch("/profile/update", auth, UpdateProfile);
router.delete("/profile/delete", auth, deleteAccount);
router.get("/profile/me", auth, getAllUserDetiles);
router.post("/profile/recovery", UndoAccount);
router.patch("/profile/image-update", auth, UpdateProfilePhoto);
router.get("/profile/recover-account/:token", verifyAccountRecovery);

//=====================Payment Route=======================

router.post("/payment/capturePayment", auth, isstudent, CapturePayment);

router.post("/payment/verifySignature", auth, isstudent, VerifyPayment);

router.post("/send-payment-email", auth, isstudent, sendPaymentSuccessEmail);
//=====================Rating Route ==================
router.post("/courses/:courseId/review", auth, createRating);
router.get("/courses/:courseId/avg-rating", auth, getAverageRating);
router.get("/courses/:courseId/reviews", getAllRatingReviews);
router.get("/courses/:courseId/coursereview", getCourseReviews);

//================Helper Function ======////
router.post("/aboutus/submit-form", submitContactForm);

//============Rating Api's==================//
router.post("/courses/:courseId/ratings", auth, isstudent, createRating);

module.exports = router;
