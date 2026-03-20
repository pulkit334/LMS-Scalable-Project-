const { response } = require("express");
const User = require("../models/User");
const Notification = require("../models/notification");
const { default: mongoose } = require("mongoose");

exports.saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id;
    let fcmToken = req.body.fcmToken;
if (!fcmToken) {
      const keys = Object.keys(req.body);

      if (keys.length > 0) {
        fcmToken = keys[0];
} else {
        return res.status(400).json({
          success: false,
          message: "FCM token is required",
        });
      }
    }

    if (!fcmToken || typeof fcmToken !== "string" || fcmToken.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Valid FCM token is required",
      });
    }

    const resposne = await User.findByIdAndUpdate(
      userId,
      {
        fcmToken,
      },
      { new: true },
    );
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "FCM token saved successfully",
    });
  } catch (err) {
return res.status(500).json({
      success: false,
      message: "Failed Network Problem",
    });
  }
};

exports.fetchNotification = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notifications = await Notification.find({ user: userId }).sort({
      createdAt: -1,
    });

    const unreadCount = await Notification.countDocuments({
      user: userId,
      read: false,
    });

    return res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (err) {
    console.error("[fetchNotification]", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Mark Read Operation's
exports.MarkReadOperations = async (req, res) => {
  try {
    let user;
    const keys = Object.keys(req.body);
    if (keys.length > 0) {
      user = keys[0];
    }
const updatedData = await Notification.findByIdAndUpdate(
      user,
      {
        read: true,
      },
      { new: true },
    );
return res.status(202).json({
      success: true,
      message: "Updated successfully",
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error ",
    });
  }
};
//Mark delete Operation's
exports.MarkDeleteOperations = async (req, res) => {
  try {
    let user;
    const keys = Object.keys(req.body);
    if (keys.length > 0) {
      user = keys[0];
    }
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }
    const deletedData = await Notification.findByIdAndDelete(user);
    if (!deletedData) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Deleted successfully",
      data: deletedData,
    });
  } catch (err) {
return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// Backend controller
exports.MarkAllReadOperations = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (
      !notificationIds ||
      !Array.isArray(notificationIds) ||
      notificationIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Notification IDs array is required",
      });
    }
    const result = await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { $set: { read: true } },
    );

    return res.status(200).json({
      success: true,
      message: `${result.modifiedCount} notifications marked as read`,
      data: result,
    });
  } catch (err) {
    console.error("Error marking all as read:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
