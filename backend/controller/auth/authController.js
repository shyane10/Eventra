const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/userModel");
const Organizer = require("../../models/organizerModel");
const { sendOtpEmail } = require("../../middlewear/nodemailer");

// ===== 1. User Register =====
exports.userRegister = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required." });
    }

    // Normalize email for searching
    const searchEmail = email.trim().toLowerCase();

    // Aggressive check for existing accounts
    const existingUser = await User.findOne({ 
      email: { $regex: new RegExp(`^${searchEmail}$`, "i") } 
    });
    
    const existingOrganizer = await Organizer.findOne({ 
      organizerEmail: { $regex: new RegExp(`^${searchEmail}$`, "i") } 
    });

    if (existingUser || existingOrganizer) {
      return res.status(400).json({ 
        message: "Account already exists with this email. Please try logging in or use a different email." 
      });
    }

    // Use normalized email for creation
    email = searchEmail;

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: otp,
      isEmailVerified: false
    });

    console.log(`✅ SUCCESS: User ${email} saved to database.`);
    await sendOtpEmail(email, otp);
    res.status(201).json({ message: "User registered! Verify OTP." });

  } catch (error) {
    console.error("DEBUG: Register Error Object:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `Registration failed: The ${field} is already in use.` 
      });
    }
    res.status(500).json({ message: "Server Error", details: error.message });
  }
};

// ===== 2. Verify OTP =====
exports.verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    // Normalize email
    email = email.trim().toLowerCase();

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

// ===== 3. User Login (UPDATED: Sends role for Admin detection) =====
exports.userLogin = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please enter email and password" });

    // Normalize email
    email = email.trim().toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your OTP first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Identify role from DB (defaults to 'user' if not set)
    const userRole = user.role || 'user';

    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      message: "Login successful",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: userRole // CRITICAL: Frontend needs this to navigate to Admin Dashboard
      }
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
      message: "Logged out successfully." 
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error during logout" });
  }
};

// ===== 5. Forgot Password =====
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({ message: "If an account exists, a reset code has been sent." });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordToken = resetCode;
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
          <p>Use the code below to reset your password. Valid for 10 minutes.</p>
          <h1 style="color: #2563eb; font-size: 40px; letter-spacing: 5px;">${resetCode}</h1>
        </div>`
    });

    res.status(200).json({ message: "Reset code sent to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Error sending reset code" });
  }
};

// ===== 6. Reset Password =====
exports.resetPassword = async (req, res) => {
  try {
    const { code, password } = req.body;

    const user = await User.findOne({ resetPasswordToken: code.toString().trim() });

    if (!user) {
      return res.status(400).json({ message: "Invalid code. Please request a new one." });
    }

    const now = new Date();
    const expiry = new Date(user.resetPasswordExpires);

    if (now > expiry) {
      return res.status(400).json({ message: "This code has expired." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    console.error("Reset Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 7. Contact Us Form =====
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required." });
    }

    const nodemailer = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: "eventra121@gmail.com",
      replyTo: email,
      subject: `New Contact Inquiry: ${subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">New Contact Message</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <div style="background: #f4f4f4; padding: 15px; border-radius: 8px;">
            <p>${message}</p>
          </div>
        </div>`
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact Email Error:", error);
    res.status(500).json({ message: "Failed to send message." });
  }
};