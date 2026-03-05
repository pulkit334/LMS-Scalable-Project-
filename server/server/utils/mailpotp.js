const nodemailer = require("nodemailer")
// require("dotenv").config()
// const mailsender = async (email,title,body)=>{
//     try {
// let transporter = nodemaler.createTransport({
//     host: process.env.MAIL_HOST,
//     auth :{
//         user:process.env.MAIL_USER,
//         pass: process.env.MAIL_PASS
//     }
// })
// let info = await  transporter.sendMail({
//     from : 'StudyNotion || Pulkit',
//     to : `${email}`,
//     subject : `${title}`,
//     html : `${body}`
// })
// return info
//     }
//     catch(err){
//         console.log(err)
//     }
// }

// module.exports = mailsenderconst nodemailer = require("nodemailer");
require("dotenv").config();

const mailsender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,  
      },
    });

    let info = await transporter.sendMail({
      from: `"StudyNotion" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("Email Sent:", info.messageId);
    return info;
  } catch (err) {
    console.log("Mail Error:", err);
  }
};

module.exports = mailsender;
