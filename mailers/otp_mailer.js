const nodemailer = require("../config/nodemailer");

exports.sendOtp = (otp, email) => {
  let htmlString = nodemailer.renderTemplate({ otp: otp }, "/otp/otp.ejs");
  console.log(email);
  nodemailer.transporter.sendMail(
    {
      from: "lsrschinmayat@gmail.com",
      to: email,
      subject: otp,
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }

      console.log("Message sent", info);
      return;
    }
  );
};
