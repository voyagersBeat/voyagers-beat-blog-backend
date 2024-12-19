const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

router.post("/contact", async (req, res) => {
  console.log("Received request:", req.body); // Debugging log
  const { name, email, subject, message } = req.body;

  // Set up transporter for Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });

  // Email options
  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL, // Your receiver email
    subject: `New Contact Form Submission: ${subject}`, // Include subject in the email subject line
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "Failed to send email",
      error: error.message, // Add error message to help debugging
      stack: error.stack, // Add error stack trace to get more details
    });
  }
});

module.exports = router;
