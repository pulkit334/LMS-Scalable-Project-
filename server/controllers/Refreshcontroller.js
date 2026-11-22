const jwt = require("jsonwebtoken");
const User = require("../models/User");


exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
        code: "REFRESH_TOKEN_MISSING",
      });
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    const newAccessToken = jwt.sign(
      {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //  if my  project depends on user.token
    user.token = newAccessToken;
    await user.save();

    return res.status(200).json({
      success: true,
      token: newAccessToken,
      message: "New access token generated",
      code: "ACCESS_TOKEN_REFRESHED",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      code: "REFRESH_TOKEN_EXPIRED",
      error: error.message,
    });
  }
};
