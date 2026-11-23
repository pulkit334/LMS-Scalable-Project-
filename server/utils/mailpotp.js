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
return info;
  } catch (err) {
throw err;
  }
};

module.exports = mailsender;
