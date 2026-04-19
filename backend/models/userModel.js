const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // --- ADDED ROLE FIELD ---
  role: {
    type: String,
    enum: ["user", "admin", "organizer"], // Restricts values to these three
    default: "user",
  },
  // ------------------------
  otp: {
    type: Number
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  },
  // --- ADDED FOR FORGOT PASSWORD ---
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpires: {
    type: Date,
    default: null
  }
  // ---------------------------------
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;