const { response } = require("express");
const User = require("../models/User");
const Notification = require("../models/notification");
const { default: mongoose } = require("mongoose");

exports.saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id;
    let fcmToken = req.body.fcmToken;

    console.log("the fcmToken would be", fcmToken);

    if (!fcmToken) {
      const keys = Object.keys(req.body);

      if (keys.length > 0) {
        fcmToken = keys[0];
        console.log(" Token extracted from keys:", fcmToken);
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
    console.log("the error is ", err);
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

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 });

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
