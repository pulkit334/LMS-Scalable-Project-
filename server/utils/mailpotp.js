const nodemailer = require("nodemailer");
require("dotenv").config();

const mailsender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, //  must be false for 587
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, //  App Password
      },
    });

    const info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.log("Mail sending error:", err.message);
    throw err;
  }
};

module.exports = mailsender;
