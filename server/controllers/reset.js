const User = require("../models/User");
const mailsender = require("../utils/mailpotp");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
//reset password token
exports.resetpasswordtoken = async (req, res) => {
  try {
    //get email from req bodyc
    const email = req.body.email;

    // check user for this email email vaidation
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.json({
        success: false,
  message: "Email is not registered",
      });
    }

    //genreate token
    const token = crypto.randomBytes(32).toString("hex");

    //   user update by adding token adn expireation
    // const updatedDetails = await User.findOneAndUpdate(
    //   { email: email },
    //   { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
    //   { new: true } //return updated doucment//*** */
    // );
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // update user with hashed token
    await User.findOneAndUpdate(
      { email: email },
      { token: hashedToken, resetPasswordExpires: Date.now() + 5 * 60 * 1000 },
      { new: true }
    );
    //   create url
    const url = `https://www.notion-x.store/update-password/${token}`;

    //send mail
    await mailsender(
      email,
      "Password Reset Link",
      `Password Reset Link is ${url} `
    );

    //   return res
    return res.json({
      success: true,
   message: "Password reset link sent successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Opps Something Went Wrong Try Again after 15s",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  //data fetch
  try {
    const { password, confirmpassword, token } = req.body;
    //validation
    if (password !== confirmpassword) {
      return res.json({
        success: false,
        message: "Password Not Matched",
      });
    }
    //get user details from db using token
    // const userdetails = await User.findOne({ token: token });
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const userdetails = await User.findOne({ token: hashedToken });
    //if no entry - invalid token
    if (!userdetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    //token time expire or not
    if (userdetails.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message: "Session Expired Try Again",
      });
    }
    // hash pwd
    const hashpwd = await bcrypt.hash(password, 10);
    //update the pass
    // await User.findOneAndUpdate(
    //   { token: token },
    //   { password: hashpwd },
    //   { new: true }
    // );

    await User.findOneAndUpdate(
      { token: hashedToken },
      { password: hashpwd, token: undefined, resetPasswordExpires: undefined },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (err) {
    res.status(400).json({
      success: true,
      message: `Error Ocurred Try again R ${err}`,
    });
  }
};
