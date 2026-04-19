const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Organizer = require("../../models/organizerModel");
const User = require("../../models/userModel");
const { sendOtpEmail } = require("../../middlewear/nodemailer");

// ===== 1. Register Request (Create organizer with OTP) =====
exports.organizerRegister = async (req, res) => {
  try {
    let { organizerName, organizerEmail, venue, password, phoneNumber } = req.body;
    
    if (!organizerName || !organizerEmail || !venue || !password || !phoneNumber) {
        return res.status(400).json({ message: "All fields are required for organizer registration." });
    }

    // Normalize email
    organizerEmail = organizerEmail.trim().toLowerCase();

    // Email check Organizer ra User dubai model ma
    const existingOrganizer = await Organizer.findOne({ organizerEmail });
    const existingUser = await User.findOne({ email: organizerEmail });

    if (existingOrganizer || existingUser) {
      return res.status(400).json({ message: "Email already exists in our system. Use a different email." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(password, 10);

    // Naya organizer create garne (isEmailVerified default: false hunchha)
    const organizer = await Organizer.create({
      organizerName,
      organizerEmail,
      venue,
      password: hashedPassword,
      phoneNumber,
      otp: otp,
      isEmailVerified: false // Model ko field sanga match gareko
    });

    console.log(`✅ SUCCESS: Organizer ${organizerEmail} saved to database.`);

    // Email pathaune
    await sendOtpEmail(organizerEmail, otp);
    
    res.status(201).json({ 
      message: "Organizer registered successfully. Please verify OTP sent to your email." 
    });
  } catch (error) {
    console.error("Register Request Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 2. Verify OTP (Update verification status) =====
exports.verifyOrganizerOtp = async (req, res) => {
  try {
    let { organizerEmail, otp } = req.body;
    
    if (!organizerEmail || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }

    // Normalize email
    organizerEmail = organizerEmail.trim().toLowerCase();

    const organizer = await Organizer.findOne({ organizerEmail });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // OTP check garne
    if (organizer.otp !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Status update garne
    organizer.isEmailVerified = true; 
    organizer.otp = null; // OTP use bhayepachhi clear garne
    await organizer.save();

    res.status(200).json({ 
      message: "Email verified successfully. You can now login to your account." 
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// ===== 3. Login (Only for verified organizers) =====
exports.organizerLogin = async (req, res) => {
  try {
    let { organizerEmail, password } = req.body;

    if (!organizerEmail || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email
    organizerEmail = organizerEmail.trim().toLowerCase();

    // Organizer khojne
    const organizer = await Organizer.findOne({ organizerEmail });

    if (!organizer) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Email verify bhako chha ki chhaina check garne
    if (!organizer.isEmailVerified) {
      return res.status(403).json({ 
        message: "Email not verified. Please verify your OTP before logging in." 
      });
    }

    // Password check garne
    const isMatch = await bcrypt.compare(password, organizer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Token generate garne
    const token = jwt.sign(
      { id: organizer._id, email: organizer.organizerEmail, role: 'organizer' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      organizer: {
        id: organizer._id,
        name: organizer.organizerName,
        email: organizer.organizerEmail
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};