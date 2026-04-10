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
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: Number
  },
  isEmailVerified: {
    type: Boolean,
    default: false
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