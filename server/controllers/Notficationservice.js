const { response } = require("express");
const User = require("../models/User");

exports.saveFcmToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fcmToken } = req.body;
    const resposne = await User.findByIdAndUpdate(userId, {
      fcmToken: fcmToken,
    });
    if (!response) {
      return res.status(403).json({
        success: false,
        message: "Error Pls Try Later",
      });
    }
  } catch (err) {
    console.log("the error is ", err);
    return res.status(500).json({
      success: false,
      message: "Failed Network Problem",
    });
  }
};
