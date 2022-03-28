const express = require("express");
const nodemailer = require("nodemailer");
const app = express.Router();
require("dotenv").config();

app.get("/", (req, res) => res.send({ msg: "Send contact using POST" }));

app.post("/", (req, res) => {
  const { name, email, textarea } = req.body;

  console.log(process.env.EMAIL, process.env.PASS);
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: `${email}`,
    to: `${process.env.EMAIL}`,
    subject: "The message was sent from from ecommerce",
    text: `${name} messaged you:
    
    ${textarea}
    
    Get back to them via ${email}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(400).send({ msg: "Email was not sent " + error });
    } else {
      console.log("Email sent: " + info.response);
      res.send({ msg: "Message was sent successfully" });
    }
  });
});

module.exports = app;
