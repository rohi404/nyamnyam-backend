const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const authNo = require("./auth-number");
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_KEY
    }
  })
);

const mailOptions = {
  from: process.env.SMTP_USER,
  to: "",
  subject: "냠냠 회원가입 인증코드",
  text: ""
};

module.exports = function(req, res, next) {
  if (req.body.email === undefined) {
    return next();
  } else {
    const code = authNo(6);
    mailOptions.to = req.body.email;
    mailOptions.text = `인증코드 ${code} 을 입력해주세요.`;

    transporter.sendMail(mailOptions, function(error) {
      if (error) {
        return next(error);
      } else {
        req.code = code;
        return next();
      }
    });
  }
};
