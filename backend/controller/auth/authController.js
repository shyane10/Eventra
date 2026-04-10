const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Added for Forgot Password
const User = require("../../models/userModel");
const Organizer = require("../../models/organizerModel");
const { sendOtpEmail } = require("../../middlewear/nodemailer");

// ===== 1. User Register =====
exports.userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email: email }, { userEmail: email }]
    });
    const existingOrganizer = await Organizer.findOne({ organizerEmail: email });

    if (existingUser || existingOrganizer) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      userEmail: email,
      password: hashedPassword,
      otp: otp,
      isEmailVerified: false
    });

    await sendOtpEmail(email, otp);
    res.status(201).json({ message: "User registered! Verify OTP." });

  } catch (error) {
    console.error("Register Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Database Index Error: Duplicate key detected." });
    }
    res.status(500).json({ message: "Server Error", details: error.message });
  }
};

// ===== 2. Verify OTP =====
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isEmailVerified = true;
    user.otp = null;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 3. User Login =====
exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please enter email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your OTP first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 4. Logout =====
exports.logout = async (req, res) => {
  try {
    res.status(200).json({ 
      success: true, 
      message: "Logged out successfully. Please clear your local storage." 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error during logout" });
  }
};

// ===== 5. Forgot Password (UPDATED) =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset code has been sent." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordToken = resetCode;
    // 10 minutes from now
    user.resetPasswordExpires = Date.now() + 600000; 
    await user.save();

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: "Your Password Reset Code",
      html: `
        <div style="font-family: sans-serif; text-align: center; padding: 20px;">
          <h2>Password Reset Code</h2>
          <p>Use the code below to reset your password. This code is valid for <strong>10 minutes</strong>.</p>
          <h1 style="color: #2563eb; font-size: 40px; letter-spacing: 5px;">${resetCode}</h1>
        </div>`
    });

    res.status(200).json({ message: "Reset code sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending reset code" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;

    // 1. Find user by code only
    const user = await User.findOne({ resetPasswordToken: code.toString().trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid code. Please request a new one." });
    }

    // 2. Check Expiry manually using Date objects
    const now = new Date();
    const expiry = new Date(user.resetPasswordExpires);

    if (now > expiry) {
      return res.status(400).json({ message: "This code has expired. Please request a new one." });
    }

    // 3. Success - Update password
    user.password = await bcrypt.hash(password, 10);
    
    // Clear the fields
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};