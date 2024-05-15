const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const env = require("./environment");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "<YOUR EMAIL>",
    pass: "<YOUR PASS KEY>",
  },
});

// define mailer
let renderTemplate = (date, relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname, "../views/mailers", relativePath),
    date,
    function (err, template) {
      if (err) {
        console.log("Error in rendering template");
        return;
      }
      mailHTML = template;
    }
  );
  return mailHTML;
};

module.exports = {
  transporter: transporter,
  renderTemplate: renderTemplate,
};
