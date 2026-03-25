const nodemailer = require("nodemailer");

require('dotenv').config(); // Load variables first

console.log("DEBUG - Loading Email Config...");
console.log("Email User Variable:", process.env.EMAIL_USER);
console.log("Email Pass Variable (first 3 chars):", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 3) + "..." : "NOT FOUND");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("CRITICAL: EMAIL_USER or EMAIL_PASS environment variables are missing!");
}
// Create the transporter using your email provider details
const transporter = nodemailer.createTransport({
  service: "gmail", // For Gmail, consider using an App Password
  auth: {
    user: process.env.EMAIL_USER, // Set this in your .env file
    pass: process.env.EMAIL_PASS  // Set this in your .env file
  }
});

// Function to send the OTP
const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Verification Code",
    text: `Your verification code is: ${otp}. It will expire in 5 minutes.`
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };