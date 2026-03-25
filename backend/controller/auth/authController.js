const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const { sendOtpEmail } = require("../../middlewear/nodemailer");
const Organizer = require("../../models/organizerModel");

// ===== 1. Register Request =====
exports.registerRequest = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    const existingOrganizer = await Organizer.findOne({ organizerEmail: email }); 

    if (existingUser || existingOrganizer) {
        return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password and generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp: otp,
      isEmailVerified: false
    });

    // Try sending email, but don't crash if it fails
    try {
      await sendOtpEmail(email, otp);
      res.status(201).json({ message: "User created. Please verify OTP sent to email." });
    } catch (emailError) {
      console.error("Email service failed:", emailError);
      // Return 201 because the user IS created, even if the email failed
      res.status(201).json({ 
        message: "User created, but email service is down. Please verify later.",
        debugOtp: otp // Useful for testing in Postman
      });
    }
  } catch (error) {
    console.error("Register Request Error:", error);
    res.status(500).json({ message: "Server Error", details: error.message });
  }
};

// ===== 2. Verify OTP =====
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
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
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 3. Login =====
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    
    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your OTP." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};