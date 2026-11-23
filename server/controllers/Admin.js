// // Insight Controller
const Course = require("../models/course");
const User = require("../models/User");
const Payment = require("../models/payment");
const category = require("../models/category");
const { default: mongoose } = require("mongoose");

exports.InsightData = async (req, res) => {
  try {
    const [
      TotalCourses,
      TotalUsers,
      TotalIns,
      totalPriceAgg,
      totalStudentsAgg,
      YearRevenue,
      LastMonthRevenueAgg,
      CategoryEnrollments,
    ] = await Promise.all([
      //Total Courses
      Course.countDocuments(),

      //   / Total Users
      User.countDocuments(),

      //   / Instructor Count
      User.countDocuments({ accountType: "instructor" }),
      //take the Catgorires details

      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),

      //   / Total Students Enrollesd
      Course.aggregate([
        { $match: { status: "PUBLISHED" } },
        { $project: { enrolledCount: { $size: "$studentEnrolled" } } },
        { $group: { _id: null, totalEnrollments: { $sum: "$enrolledCount" } } },
      ]),

      //   / Monthly Revenue
      Payment.aggregate([
        { $match: { status: "success" } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$price" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      //Last Month Revenue (latest month)
      Payment.aggregate([
        { $match: { status: "success" } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: "$price" },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 1 },
      ]),

      Course.aggregate([
        { $match: { status: "PUBLISHED" } },
        { $unwind: "$studentEnrolled" },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryData",
          },
        },
        { $unwind: "$categoryData" },
        {
          $group: {
            _id: "$categoryData.name",
            total: { $sum: 1 },
          },
        },
      ]),
    ]);

    const TotalPrice = totalPriceAgg?.[0]?.total || 0;
    const TotalStudents = totalStudentsAgg?.[0]?.totalEnrollments || 0;
    const LastMonthRevenue = LastMonthRevenueAgg?.[0]?.total || 0;

    return res.status(202).json({
      success: true,
      message: "Admin Insights Data",
      data: {
        TotalCourses,
        TotalUsers,
        TotalIns,
        TotalPrice,
        TotalStudents,

        charts: {
          YearRevenue,

          LastMonthRevenue,
          CategoryEnrollments,
        },
      },
    });
  } catch (error) {
return res.status(500).json({
      success: false,
      message: "Failed To Fetch",
      error: error.message,
    });
  }
};

//
exports.InstructorData = async (req, res) => {
  try {
    //pagination
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    //Sirf Only Take Instuctor Info Other Then Nothing I Want
    const filter = {
      accountType: "instructor",
      ...(search
        ? {
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };

    const [InstructorData, total] = await Promise.all([
      User.find(filter)
        .select("firstName lastName  status  image createdAt email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);

    const instructorIds = InstructorData.map((inst) => inst._id);

    const CourseCount = await Course.aggregate([
      { $match: { Insturctor: { $in: instructorIds } } },
      {
        $group: { _id: "$Insturctor", count: { $sum: 1 } },
      },
    ]);

    //abh Bahiya Map Kar Lo use the map Me Jayda Socho Mat 😭 Matha Karab Ho Gaya Yaha tak
    const map = new Map();
    CourseCount.forEach((c) => {
      map.set(c._id.toString(), c.count);
    });
    //
    //Course Related Reviews
    const AvgRating = await Course.aggregate([
      { $match: { Insturctor: { $in: instructorIds } } },

      {
        $lookup: {
          from: "ratingandreviews",
          localField: "_id",
          foreignField: "Course", // make sure field name is correct
          as: "reviews",
        },
      },

      { $unwind: "$reviews" },

      {
        $group: {
          _id: "$Insturctor",
          avgRating: { $avg: "$reviews.rating" },
        },
      },
    ]);

    const RatingMap = new Map();
    AvgRating.forEach((c) => {
      RatingMap.set(c._id.toString(), c.avgRating);
    });
    const FinalData = InstructorData.map((c) => ({
      ...c.toObject(),
      CourseCount: map.get(c._id.toString()) || 0,
      AvgRating: Number(RatingMap.get(c._id.toString()) || 0),
    }));
    const totalPages = Math.ceil(total / limit);
    // abh Merge Kar dete hai Codes Ko As Insturtor wiht firtsName LastName and _id->Count Merge
return res.status(202).json({
      success: true,
      message: "All instructors fetched",
      data: {
        instructors: FinalData,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
return res.status(500).json({
      success: false,
      message: "Failed To Fetch",
      error: error.message,
    });
  }
};

//user managment
exports.UserMangment = async (req, res) => {
  try {
    //Pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 7;

    const skip = (page - 1) * limit;
    // student Filter Student and Instrcuor
    const search = req?.query?.search || "";
    //  only student + instructor
    const filter = {
      accountType: { $in: ["instructor", "student"] },
      ...(search
        ? {
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    };
    const [AllData, total] = await Promise.all([
      User.find(filter)
        .select("firstName lastName image status email accountType isdeleted")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit);
    return res.status(202).json({
      data: {
        AllData,
        pagination: {
          pages: totalPages,
          page,
          skip,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (err) { 
return res.status(500).json({
      success: false,
      message: "Failed To Fetch",
      error: err.message,
    });
  }
};

//   try {
//     const search = req.query.search?.trim();
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 10;
//     const skip = (page - 1) * limit;

//     const filter = search
//       ? {
//           courseName: { $regex: /pattern/search, $options: "i" },
//         }
//       : {};

//     const [Data, total] = await Promise.all([
//       Course.find(filter)
//         .select("courseName status thumbnail studentEnrolled createdAt")
//         .populate("category", "name description")
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit),

//       Course.countDocuments(filter),
//     ]);

//     const FinalData = Data.map((c) => ({
//       ...c.toObject(),
//       enrollments: c.studentEnrolled?.length || 0,
//     }));

//     const totalPages = Math.ceil(total / limit);

//     res.status(200).json({
//       success: true,
//       data: {
//         CourseData: FinalData,
//         pagination: {
//           page,
//           limit,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//         },
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Failed To Fetch",
//     });
//   }
// };
exports.CourseManagment = async (req, res) => {
  //serach  -> Pagination
  try {
    const search = req?.query?.search?.trim() || "";
    const page = Number(req?.query?.page) || 1;
    const limit = Number(req?.query?.limit) || 10;
    const skip = (page - 1) * limit;
    //Instructor -> category -> Emailaddress -> CoruseName -> Image -> status-> Visisbilty
    const filter = {
      ...(search ? { $text: { $search: search } } : {}),
    };
    // console.log(Course.find*());
    const [Data, total] = await Promise.all([
      Course.find(filter)
        .select(
          "courseName status thumbnail studentEnrolled thumbnail createdAt",
        )
        .populate({
          path: "category",
          select: "name description",
        })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),

      Course.countDocuments(filter),
    ]);
    const FinalData = Data.map((c) => ({
      ...c.toObject(),
      enrollments: c.studentEnrolled?.length || 0,
    }));
    const totalPages = Math.ceil(total / limit);
    res.status(202).json({
      success: true,
      message: "Data is",
      data: {
        CourseData: FinalData,
        pagination: {
          limit,
          skip,
          pages: totalPages,
          page,
          hasNextPage: page < totalPages,
          hasPrevpage: page > 1,
        },
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed To Fetch",
    });
  }
};

// Chart Data
exports.chartMangment = async (req, res) => {
  try {
    // Later We Can DO Chart Analysis
    //first Set 12 Months Data Atleast
    const StartDate = new Date();
    StartDate.setMonth(StartDate.getMonth() - 12);
    StartDate.setDate(1);
    StartDate.setHours(0, 0, 0, 0);

    const trendData = await Course.aggregate([
      //kinte User Kis Course Me Enroll Huye Sabse Jyada
      {
        $match: {
          createdAt: { $gte: StartDate },
          status: "PUBLISHED",
        },
      },
      {
        $project: {
          category: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          enrollments: { $size: { $ifNull: ["$studentEnrolled", []] } },
        },
      },
      {
        $group: {
          _id: {
            category: "$category",
            year: "$year",
            month: "$month",
          },
          totalEnrollments: { $sum: "$enrollments" },
        },
      },

      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    return res.status(202).json({
      success: true,
      message: "Enrollment trends for last 1 year",
      data: trendData,
    });
  } catch (err) {
return res.status(500).json({
      success: false,
      message: "Failed To Fetch",
    });
  }
};
//Top N COurses I want By N Enrollemtn
exports.getTopCourses = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 4;
    const TopCoursesData = await Course.aggregate([
      { $match: { status: "PUBLISHED" } },

      {
        $project: {
          category: 1,
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          enrollments: {
            $size: { $ifNull: ["$studentEnrolled", []] },
          },
        },
      },

      {
        $group: {
          _id: {
            category: "$category",
            year: "$year",
            month: "$month",
          },
          totalEnrollments: { $sum: "$enrollments" },
        },
      },

      { $sort: { totalEnrollments: -1 } },
      { $limit: limit },

      {
        $lookup: {
          from: "categories",
          localField: "_id.category",
          foreignField: "_id",
          as: "CategoryData",
        },
      },

      { $unwind: "$CategoryData" },

      {
        $project: {
          _id: 0,
          categoryId: "$CategoryData._id",
          categoryName: "$CategoryData.name",
          year: "$_id.year",
          month: "$_id.month",
          totalEnrollments: 1,
        },
      },
    ]);
    res.json({ success: true, TopCoursesData });
  } catch (err) {
res.status(500).json({
      success: false,
      message: "Failed To Fetch",
    });
  }
};

// Toggle For Status Active / Course -> draft or Published


exports.statusUpgrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instructor id",
      });
    }

    if (!["Active", "InActive", "Blocked"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("firstName lastName email status");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Instructor not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status. Please try again.",
    });
  }
};

exports.toggleCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid course id" });
    }

    const existing = await Course.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const nextStatus = ["PUBLISHED", "DRAFT"].includes(status)
      ? status
      : existing.status === "PUBLISHED"
        ? "DRAFT"
        : "PUBLISHED";

    existing.status = nextStatus;
    await existing.save();

    try {
      const redisClient = require("../Reddis/client");
      await redisClient.del("Category:All", `Cache:Course:${id}`);
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: `Course marked as ${nextStatus}`,
      data: { _id: existing._id, status: existing.status },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update course status",
    });
  }
};

exports.adminDeleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid course id" });
    }

    const courseDoc = await Course.findById(id);
    if (!courseDoc) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const Section = require("../models/section");
    const Subsection = require("../models/subsection");

    for (const secId of courseDoc.courseContent || []) {
      const sec = await Section.findById(secId);
      if (sec?.subsection?.length) {
        await Subsection.deleteMany({ _id: { $in: sec.subsection } });
      }
      await Section.findByIdAndDelete(secId);
    }

    if (courseDoc.category) {
      await category.findByIdAndUpdate(courseDoc.category, {
        $pull: { course: courseDoc._id },
      });
    }

    if (courseDoc.Insturctor) {
      await User.findByIdAndUpdate(courseDoc.Insturctor, {
        $pull: { courses: courseDoc._id },
      });
    }

    await Course.findByIdAndDelete(id);

    try {
      const redisClient = require("../Reddis/client");
      await redisClient.del("Category:All", `Cache:Course:${id}`, `Cache:CourseContent:${id}`);
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: "Course deleted permanently",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to delete course",
    });
  }
};

// Ultra-Advanced Statistical Per-Student Performance Engine
exports.getStudentPerformanceAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid student ID" });
    }

    const CourseProgress = require("../models/courseporgress");
    const QuizAttempt = require("../models/quizAttempt");

    const student = await User.findById(id)
      .select("firstName lastName email accountType status image createdAt")
      .lean();

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const [enrolledCourses, studentProgressDocs, studentQuizzes, allStudents, allProgressDocs, allQuizzes] =
      await Promise.all([
        Course.find({ studentEnrolled: id })
          .select("courseName price category courseContent createdAt")
          .populate({ path: "courseContent", select: "subsection" })
          .populate("category", "name")
          .lean(),
        CourseProgress.find({ userId: id }).lean(),
        QuizAttempt.find({ userId: id }).sort({ createdAt: 1 }).lean(),
        User.find({ accountType: /^student$/i }).select("_id").lean(),
        CourseProgress.find({}).select("userId courseId completedVideos").lean(),
        QuizAttempt.find({}).select("userId weightedScore accuracy").lean(),
      ]);

    const progressMap = new Map();
    studentProgressDocs.forEach((p) => {
      progressMap.set(String(p.courseId), p);
    });

    // Per-course performance breakdown
    let totalLecturesAll = 0;
    let totalCompletedAll = 0;
    let latestActivityMs = student.createdAt ? new Date(student.createdAt).getTime() : Date.now();

    const perCourse = enrolledCourses.map((c) => {
      const lecIds = new Set();
      (c.courseContent || []).forEach((sec) => {
        (sec.subsection || []).forEach((subId) => lecIds.add(String(subId)));
      });
      const totalLectures = lecIds.size;
      const prog = progressMap.get(String(c._id));
      const completedCount = (prog?.completedVideos || []).filter((v) =>
        lecIds.has(String(v))
      ).length;
      const completionPct =
        totalLectures > 0 ? Math.round((completedCount / totalLectures) * 1000) / 10 : 0;

      totalLecturesAll += totalLectures;
      totalCompletedAll += completedCount;

      if (prog?.updatedAt) {
        latestActivityMs = Math.max(latestActivityMs, new Date(prog.updatedAt).getTime());
      }

      const courseQuizzes = studentQuizzes.filter(
        (q) => String(q.courseId) === String(c._id)
      );
      const avgQuizAccuracy =
        courseQuizzes.length > 0
          ? Math.round(
              (courseQuizzes.reduce((s, q) => s + (q.accuracy || 0), 0) /
                courseQuizzes.length) *
                10
            ) / 10
          : null;
      const weightedQuizScore =
        courseQuizzes.length > 0
          ? Math.round(
              (courseQuizzes.reduce((s, q) => s + (q.weightedScore || 0), 0) /
                courseQuizzes.length) *
                10
            ) / 10
          : null;

      return {
        courseId: c._id,
        courseName: c.courseName,
        category: c.category?.name || "General",
        totalLectures,
        completedLectures: completedCount,
        completionPct,
        quizAttempts: courseQuizzes.length,
        avgQuizAccuracy,
        weightedQuizScore,
        certificateEarned: totalLectures > 0 && completedCount >= totalLectures,
        lastActivityAt: prog?.updatedAt || prog?.createdAt || null,
      };
    });

    const overallCompletionPct =
      perCourse.length > 0
        ? Math.round(
            (perCourse.reduce((s, c) => s + c.completionPct, 0) / perCourse.length) * 10
          ) / 10
        : 0;

    // Quiz statistics: weighted mean, std dev (volatility), CV, consistency, difficulty breakdown
    const quizCount = studentQuizzes.length;
    const quizScores = studentQuizzes.map((q) => Number(q.weightedScore ?? q.accuracy ?? 0));
    const rawAccuracies = studentQuizzes.map((q) => Number(q.accuracy ?? 0));

    const meanQuizWeighted =
      quizCount > 0 ? quizScores.reduce((a, b) => a + b, 0) / quizCount : null;
    const meanQuizRaw =
      quizCount > 0 ? rawAccuracies.reduce((a, b) => a + b, 0) / quizCount : null;

    let stdDevQuiz = 0;
    if (quizCount > 1 && meanQuizWeighted !== null) {
      const variance =
        quizScores.reduce((acc, val) => acc + Math.pow(val - meanQuizWeighted, 2), 0) /
        quizCount;
      stdDevQuiz = Math.sqrt(variance);
    }

    const cv =
      meanQuizWeighted && meanQuizWeighted > 0 ? stdDevQuiz / meanQuizWeighted : 0;
    const consistencyScore =
      quizCount > 1
        ? Math.max(0, Math.min(100, Math.round((100 - Math.min(100, cv * 100)) * 10) / 10))
        : quizCount === 1
          ? 100
          : null;

    // Difficulty breakdown aggregate
    const diffTotals = {
      easyCorrect: 0,
      easyTotal: 0,
      mediumCorrect: 0,
      mediumTotal: 0,
      hardCorrect: 0,
      hardTotal: 0,
    };
    studentQuizzes.forEach((q) => {
      const b = q.difficultyBreakdown || {};
      diffTotals.easyCorrect += b.easyCorrect || 0;
      diffTotals.easyTotal += b.easyTotal || 0;
      diffTotals.mediumCorrect += b.mediumCorrect || 0;
      diffTotals.mediumTotal += b.mediumTotal || 0;
      diffTotals.hardCorrect += b.hardCorrect || 0;
      diffTotals.hardTotal += b.hardTotal || 0;
      if (q.createdAt) {
        latestActivityMs = Math.max(latestActivityMs, new Date(q.createdAt).getTime());
      }
    });

    // Mastery Index M in [0, 100]
    const effectiveQuiz = meanQuizWeighted !== null ? meanQuizWeighted : overallCompletionPct;
    const effectiveConsistency =
      consistencyScore !== null ? consistencyScore : overallCompletionPct;
    const masteryIndex =
      quizCount > 0
        ? Math.round(
            (0.45 * overallCompletionPct +
              0.4 * effectiveQuiz +
              0.15 * effectiveConsistency) *
              10
          ) / 10
        : Math.round((0.8 * overallCompletionPct + 0.2 * (enrolledCourses.length > 0 ? 100 : 0)) * 10) / 10;

    // Learning Velocity (lectures/week) & ETA
    const accountAgeDays = Math.max(
      1,
      (Date.now() - new Date(student.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
    );
    const weeksActive = Math.max(0.25, accountAgeDays / 7);
    const velocityPerWeek = Math.round((totalCompletedAll / weeksActive) * 100) / 100;
    const remainingLectures = Math.max(0, totalLecturesAll - totalCompletedAll);
    const estimatedDaysToFinish =
      velocityPerWeek > 0 && remainingLectures > 0
        ? Math.ceil((remainingLectures / velocityPerWeek) * 7)
        : remainingLectures === 0
          ? 0
          : null;

    // Cohort Z-score & Percentile Rank across all students
    const allCoursesMap = new Map();
    const allCoursesRaw = await Course.find({}).select("_id courseContent studentEnrolled").populate({ path: "courseContent", select: "subsection" }).lean();
    allCoursesRaw.forEach((c) => {
      const total = (c.courseContent || []).reduce((s, sec) => s + (sec.subsection?.length || 0), 0);
      allCoursesMap.set(String(c._id), { total, enrolled: new Set((c.studentEnrolled || []).map(String)) });
    });

    const cohortMasteryScores = allStudents.map((st) => {
      const sid = String(st._id);
      let enrolledCount = 0;
      let compSum = 0;
      allCoursesMap.forEach((cInfo, cId) => {
        if (cInfo.enrolled.has(sid)) {
          enrolledCount++;
          const prog = allProgressDocs.find(
            (p) => String(p.userId) === sid && String(p.courseId) === cId
          );
          const pct = cInfo.total > 0 ? ((prog?.completedVideos?.length || 0) / cInfo.total) * 100 : 0;
          compSum += Math.min(100, pct);
        }
      });
      const avgComp = enrolledCount > 0 ? compSum / enrolledCount : 0;
      const stQuizzes = allQuizzes.filter((q) => String(q.userId) === sid);
      const qAvg =
        stQuizzes.length > 0
          ? stQuizzes.reduce((s, q) => s + (q.weightedScore ?? q.accuracy ?? 0), 0) / stQuizzes.length
          : avgComp;
      return stQuizzes.length > 0 ? 0.55 * avgComp + 0.45 * qAvg : avgComp;
    });

    const cohortMean =
      cohortMasteryScores.length > 0
        ? cohortMasteryScores.reduce((a, b) => a + b, 0) / cohortMasteryScores.length
        : 0;
    const cohortVariance =
      cohortMasteryScores.length > 1
        ? cohortMasteryScores.reduce((a, v) => a + Math.pow(v - cohortMean, 2), 0) /
          cohortMasteryScores.length
        : 0;
    const cohortStdDev = Math.sqrt(cohortVariance);

    const zScore =
      cohortStdDev > 0.001
        ? Math.round(((masteryIndex - cohortMean) / cohortStdDev) * 100) / 100
        : 0;
    const belowCount = cohortMasteryScores.filter((v) => v <= masteryIndex).length;
    const percentileRank =
      cohortMasteryScores.length > 0
        ? Math.round((belowCount / cohortMasteryScores.length) * 100)
        : 50;

    // Logistic Dropout / At-Risk Probability: P = 1 / (1 + exp(-z_risk))
    const daysInactive = Math.max(0, (Date.now() - latestActivityMs) / (1000 * 60 * 60 * 24));
    const zRisk =
      -0.045 * (overallCompletionPct - 45) -
      0.03 * ((meanQuizWeighted ?? overallCompletionPct) - 55) +
      0.08 * Math.min(30, daysInactive) -
      0.35 * Math.min(4, velocityPerWeek);
    const dropoutRiskPct =
      enrolledCourses.length === 0
        ? 0
        : Math.round((1 / (1 + Math.exp(-zRisk))) * 1000) / 10;

    let performanceTier = "On Track";
    if (masteryIndex >= 80 && dropoutRiskPct < 30) performanceTier = "Excelling";
    else if (dropoutRiskPct >= 65 || masteryIndex < 35) performanceTier = "At Risk";
    else if (dropoutRiskPct >= 45 || masteryIndex < 55) performanceTier = "Needs Attention";

    return res.status(200).json({
      success: true,
      data: {
        student,
        summary: {
          enrolledCount: enrolledCourses.length,
          certificatesEarned: perCourse.filter((c) => c.certificateEarned).length,
          totalLectures: totalLecturesAll,
          completedLectures: totalCompletedAll,
          overallCompletionPct,
          quizSampleSize: quizCount,
          rawQuizAvg: meanQuizRaw !== null ? Math.round(meanQuizRaw * 10) / 10 : null,
          weightedQuizAvg:
            meanQuizWeighted !== null ? Math.round(meanQuizWeighted * 10) / 10 : null,
          quizVolatilityStdDev: Math.round(stdDevQuiz * 100) / 100,
          coefficientOfVariation: Math.round(cv * 1000) / 1000,
          consistencyScore,
          masteryIndex,
          cohortMean: Math.round(cohortMean * 10) / 10,
          cohortStdDev: Math.round(cohortStdDev * 10) / 10,
          zScore,
          percentileRank,
          velocityPerWeek,
          estimatedDaysToFinish,
          daysInactive: Math.round(daysInactive * 10) / 10,
          dropoutRiskPct,
          performanceTier,
        },
        difficultyMastery: {
          EASY: {
            correct: diffTotals.easyCorrect,
            total: diffTotals.easyTotal,
            pct:
              diffTotals.easyTotal > 0
                ? Math.round((diffTotals.easyCorrect / diffTotals.easyTotal) * 100)
                : null,
          },
          MEDIUM: {
            correct: diffTotals.mediumCorrect,
            total: diffTotals.mediumTotal,
            pct:
              diffTotals.mediumTotal > 0
                ? Math.round((diffTotals.mediumCorrect / diffTotals.mediumTotal) * 100)
                : null,
          },
          HARD: {
            correct: diffTotals.hardCorrect,
            total: diffTotals.hardTotal,
            pct:
              diffTotals.hardTotal > 0
                ? Math.round((diffTotals.hardCorrect / diffTotals.hardTotal) * 100)
                : null,
          },
        },
        perCourse,
        recentQuizzes: studentQuizzes.slice(-8).reverse(),
      },
    });
  } catch (err) {
    console.error("getStudentPerformanceAnalytics error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to compute student performance analytics",
    });
  }
};

