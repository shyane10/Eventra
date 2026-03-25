const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organizer = require("../../models/organizerModel");
const User = require("../../models/userModel"); // Make sure this path is correct
const { sendOtpEmail } = require("../../middlewear/nodemailer");

// ===== 1. Register Request (Create temporary organizer with OTP) =====
exports.organizerRegister = async (req, res) => {
  try {
    const { organizerName, organizerEmail, venue, password, phoneNumber } = req.body;

    // Ensure BOTH are defined before checking
    const existingOrganizer = await Organizer.findOne({ organizerEmail });
    const existingUser = await User.findOne({ email: organizerEmail }); // Check User model

    if (existingOrganizer || existingUser) {
        return res.status(400).json({ message: "Email already exists in our system" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    const organizer = await Organizer.create({
      organizerName,
      organizerEmail,
      venue,
      password: hashedPassword,
      phoneNumber,
      otp: otp,
      isOtpVerified: false
    });

    await sendOtpEmail(organizerEmail, otp);
    res.status(201).json({ message: "Organizer created. Please verify OTP sent to email." });
  } catch (error) {
    console.error("Register Request Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 2. Verify OTP (Update organizer status) =====
exports.verifyOrganizerOtp = async (req, res) => {
  try {
    const { organizerEmail, otp } = req.body;
    const organizer = await Organizer.findOne({ organizerEmail });

    if (!organizer) return res.status(404).json({ message: "Organizer not found" });

    if (organizer.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    organizer.isOtpVerified = true;
    organizer.otp = null; 
    await organizer.save();

    res.status(200).json({ message: "Email verified successfully. You can now login." });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 3. Login (Only allows verified organizers) =====
exports.organizerLogin = async (req, res) => {
  try {
    const { organizerEmail, password } = req.body;
    const organizer = await Organizer.findOne({ organizerEmail });

    if (!organizer) return res.status(400).json({ message: "Invalid credentials" });
    
    if (!organizer.isOtpVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify your OTP." });
    }

    const isMatch = await bcrypt.compare(password, organizer.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: organizer._id, email: organizer.organizerEmail }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );
    
    res.json({ token, organizer: { id: organizer._id, name: organizer.organizerName } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};