// // Insight Controller
const Course = require("../models/course");
const User = require("../models/User");
const Payment = require("../models/payment");


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
    ] = await Promise.all([
      //Total Courses
      Course.countDocuments(),

      //   / Total Users
      User.countDocuments(),

      //   / Instructor Count
      User.countDocuments({ accountType: "instructor" }),

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
    ]);

    const TotalPrice = totalPriceAgg?.[0]?.total || 0;
    const TotalStudents = totalStudentsAgg?.[0]?.totalEnrollments || 0;
    const LastMonthRevenue = LastMonthRevenueAgg?.[0]?.total || 0;

    return res.status(200).json({
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
      ...(search ? { $text: { $search: search } } : {}),
    };
    const [InstructorData, total] = await Promise.all([
      User.find(filter)
        .select("firstName lastName  image createdAt email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      User.countDocuments(filter),
    ]);
    // console.log("the data")
    // Course Count For Each Instructor Data //
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

    const FinalData = InstructorData.map((c) => ({
      ...c.toObject(),
      CourseCount: map.get(c._id.toString()) || 0,
    }));

    // abh Merge Kar dete hai Codes Ko As Insturtor wiht firtsName LastName and _id->Count Merge
    return res.status(200).json({
      success: true,
      message: "All instructors fetched",
      data: {
        instructors: FinalData,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
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

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const skip = (page - 1) * limit;
    // student Filter Student and Instrcuor
    const search = req?.query?.search?.trim() || "";
    //  only student + instructor
    const filter = {
      accountType: { $in: ["instructor", "student"] },
      ...(search ? { $text: { $search: search } } : {}),
    };
    const [AllData, total] = await Promise.all([
      User.find(filter)
        .select("firstName lastName image status email accountType isdeleted")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    return res.status(202).json({
      data: {
        AllData,
        pagination: {
          pages: Math.ceil(total / limit),
          page,
          skip,
          limit,
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

exports.CourseManagment = async (req, res) => {
  //serach  -> Pagination
  try {
    const search = Number(req?.query?.search?.trim() || "");
    const page = req?.query?.page || 1;
    const limit = req?.query?.limit || 10;
    const skip = (page - 1) * limit;
    //Instructor -> category -> Emailaddress -> CoruseName -> Image -> status-> Visisbilty
    const filter = {
      ...(search ? { $text: { $search: search } } : {}),
    };
    // console.log(Course.find*());
    const [Data, total] = await Promise.all([
      Course.find(filter)
        .select("-course")
        .select(
          "courseName  status -course  studentEnrolled  thumbnail createdAt",
        )
        .populate("category", { select: "name description -course" })

        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 }),

      Course.countDocuments(filter || []),
    ]);
    const FinalData = Data.map((c) => ({
      ...c.toObject(),
      enrollments: c.studentEnrolled?.length || 0,
    }));

    res.status(202).json({
      success: true,
      message: "Data is",
      data: {
        CourseData: FinalData,
        pagination: {
          limit,
          skip,
          page: Math.ceil(total / limit),
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
    StartDate.setMonth(StartDate.getMonth() - 11);
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
          enrollments: { $size: { $ifNull :["$studentsEnrolled",[]]} },
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
    console.log(err?.message);
    return res.status(500).json({
      success: false,
      message: "Failed To Fetch",
    });
  }
};

// Toggle For Status Active / Course -> draft or Published
