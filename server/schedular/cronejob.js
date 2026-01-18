const cron = require("node-cron");
const course = require("../models/course");
const Profile = require("../models/profile");
const User = require("../models/User");
const TWO_HOURS = 2 * 60 * 60 * 1000;
const mailsender = require("../utils/mailpotp");


const deletion = async () => {
  try {
    const thresholdTime = new Date(Date.now() - TWO_HOURS);

    // 1️ Fetch only required fields (lean = faster, less memory)
    const users = await User.find(
      {
        isdeleted: true,
        deleteRequestedAt: { $lte: thresholdTime },
      },
      {
        _id: 1,
        email: 1,
        courses: 1,
        additionalDetails: 1,
      }
    ).lean();

    if (!users.length) return;

    // 2️ Prepare bulk operations
    const userIds = users.map((u) => u._id);
    const profileIds = users.map((u) => u.additionalDetails).filter(Boolean);

    // 3️Remove users from enrolled courses (single bulk op)
    await course.updateMany(
      { studentEnrolled: { $in: userIds } },
      { $pull: { studentEnrolled: { $in: userIds } } }
    );
    // 4️ Parallel deletions (FAST)
    await Promise.all([
      Profile.deleteMany({ _id: { $in: profileIds } }),
      User.deleteMany({ _id: { $in: userIds } }),
    ]);

    // 5️ Fire-and-forget emails (non-blocking)
    users.forEach((user) => {
      mailsender(
        user.email,
        "Account Deleted - StudyNotion",
        "Your account has been permanently deleted."
      ).catch(() => {}); // avoid cron crash
    });

    console.log(` Deleted ${users.length} users successfully`);
  } catch (err) {
    console.error(" Cron deletion error:", err);
  }
};

cron.schedule("*/5 * * * * *", deletion);
