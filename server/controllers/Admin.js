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
    console.log(error);
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
    console.log("FINAL DATA LENGTH:", FinalData.length);

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
    console.log("the Admin is", error);
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
    console.log("The error is ", err);
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
    console.log(err?.message);
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
    console.log(err);
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

