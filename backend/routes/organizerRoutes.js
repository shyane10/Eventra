const express = require("express");
const router = express.Router();
const { 
  organizerRegister, 
  organizerLogin, 
  verifyOrganizerOtp 
} = require("../controller/organizer/organizerController.js");

// ====== Organizer Authentication Routes ======

/**
 * @route   POST /api/organizer/register
 * @desc    Register a new organizer & send OTP
 */
router.post("/organizerRegister", organizerRegister);

/**
 * @route   POST /api/organizer/verify-otp
 * @desc    Verify email using OTP
 */
router.post("/verify-otp", verifyOrganizerOtp);

/**
 * @route   POST /api/organizer/login
 * @desc    Login organizer & return JWT token
 */
router.post("/organizerLogin", organizerLogin);


// Future use ko lagi (Commented out but structured)
/*
// router.post("/forgot-password", organizerForgotPassword);
// router.post("/reset-password", organizerResetPassword);
*/

module.exports = router;