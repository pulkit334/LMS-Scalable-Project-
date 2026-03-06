const express = require("express");
const router = express.Router();
const { auth, isinstructor, isstudent, admin } = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
// const passport = require("passport");
const { cacheMiddleware } = require("../middlewares/Caching");
//************** for Authentication **************//
const {
  sendOtp,
  sinup,
  login,
  changePassword,
  googleLogin,
} = require("../controllers/Auth");

const { resetpasswordtoken, resetPassword } = require("../controllers/reset");

//==============Refresh Token =====================//
const { refresh } = require("../controllers/Refreshcontroller");

router.post("/refresh", refresh);

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
  InstructorDashboard,
} = require("../controllers/Profile");
//***********************Rating and Reviews ***********//
const {
  createRating,
  getAverageRating,
  getCourseReviews,
  getAllRatingReviews,
  sliderReview,
  updateRating,
} = require("../controllers/rating_review");

//****************Form Contact Helper *********** */
const { submitContactForm } = require("../controllers/contactform");

//*************** Basic payment Gateways Attached ***************
const {
  CapturePayment,
  enrolledStudent,
  VerifyPayment,
  sendPaymentSuccessEmail,
  Paymenthistory,
} = require("../controllers/payment");
const { saveCartItems, getcartitems } = require("../controllers/cart");

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
router.get(
  "/courses",
  auth,
  isinstructor,
  // cacheMiddleware((req) => "Courses:ALL", 100),
  ShowCourses,
);
//Protected
router.get(
  "/enrolled-courses",
  auth,
  cacheMiddleware((req) => "Enrolled-Course", 60),
  getEnrolledCourses,
);

router.post("/publish-courses", auth, changestatus);
// Protected
router.patch("/course/update/:courseId", auth, isinstructor, updateCourse);

//Payment Course Loader
router.get("/course/:courseId", auth, isstudent, getCourse);
router.get("/course/:courseId/content", auth, isstudent, getCourseContent);
router.get("/course/:courseId/reviews", auth, getPaymentCourseReviews);
router.get(
  "/user/purchased-history",
  auth,
  // cacheMiddleware((req) => `Cache:purchased-History`, 3000),
  isstudent,
  Paymenthistory,
);

router.get(
  "/getFullCourseDetails/:courseId",
  auth,
  cacheMiddleware((req) => `Cache:CourseDeatails`, 60),
  getFullCourseDetails,
);
// routes/course.js
// add validation in it

router.delete("/course/:courseId", auth, deleteCourse);

//COurse progress
router.post(
  "/course/updateCourseProgress",
  auth,
  isstudent,
  markLectureComplete,
);

// ================= SECTION ROUTES =================

// Protected
router.post("/course/create", auth, isinstructor, createCourse);
router.put("/section/update", isinstructor, updateSection);
router.delete("/section/delete/:sectionId", auth, deleteSection, deleteSection);

// GET SECTION
router.get(
  "/section/:sectionId",
  auth,
  cacheMiddleware((req) => `Cache:section:${req.params.sectionId}`),
  isstudent,
  section,
);
router.post("/section/create", auth, createSection);

// ================= SUBSECTION ROUTES =================

// Protected
router.post("/subsection/create", auth, isinstructor, createSubsection);

// GET SUBSECTION
router.get(
  "/subsection/:subSectionId",
  auth,
  isinstructor,
  cacheMiddleware((req) => `Cache:section:${req.params.subsectionId}`),
  subsection,
);
//modifying Subsection
router.patch("/subsection/:subSectionId", auth, isinstructor, UpdateSubsection);
// ================= CATEGORY ROUTES =================

// Protected (create)
router.post("/category/create", auth, Category);

// Public (all categories)
router.get(
  "/category/all",
  auth,
  cacheMiddleware((req) => "Category:All", 360),
  AllCategory,
);
router.post(
  "/course/getCategoryPageDetails",
  auth,
  cacheMiddleware((req) => `Cache:CategoryDetails`, 300),
  CategoryPageDetails,
);

// ================= PROFILE ROUTES =================
router.patch("/profile/update", auth, UpdateProfile);
router.delete("/profile/delete", auth, deleteAccount);
router.get("/profile/me", auth, getAllUserDetiles);
router.post("/profile/recovery", UndoAccount);
router.patch("/profile/image-update", auth, UpdateProfilePhoto);
router.get("/profile/recover-account/:token", verifyAccountRecovery);
router.get("/instructor/course", auth, isinstructor, InstructorDashboard);
//=====================Payment Route=======================

router.post("/payment/capturePayment", auth, isstudent, CapturePayment);

router.post("/payment/verifySignature", auth, isstudent, VerifyPayment);

router.post("/send-payment-email", auth, isstudent, sendPaymentSuccessEmail);
//=====================Rating Route ==================
router.post("/courses/:courseId/review", auth, createRating);
router.get(
  "/courses/:courseId/avg-rating",
  auth,
  // cacheMiddleware(
  //   (req) => `Cache:AvgRating:/courses${req.params.courseId}/avg-rating`,
  // ),
  getAverageRating,
);
router.patch("/update-review/:reviewId", auth, updateRating);

router.get("/courses/reviews", sliderReview);
router.get("/my-lecture/:courseId/coursereview", getCourseReviews);
router.get("/payment-review/:courseId/review", getCourseReviews);
//================Helper Function ======////
router.post("/aboutus/submit-form", submitContactForm);

//============Rating Api's==================//
router.post("/courses/:courseId/ratings", auth, isstudent, createRating);

//cart routes
router.post("/user/add-to-cart", auth, isstudent, saveCartItems);
router.get("/user/get-cart", auth, isstudent, getcartitems);
router.get("/test-notification",auth,isstudent);

//google auth 
router.get("/auth/google",googleLogin)
module.exports = router;
