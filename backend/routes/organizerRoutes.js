const express = require("express");
const router = express.Router();
const { organizerRegister, organizerLogin, verifyOrganizerOtp } = require("../controller/organizer/organizerController.js");

// ====== Organizer Auth Routes ======

// Register a new organizer
router.post("/organizerRegister", organizerRegister);

// Login organizer
router.post("/organizerLogin", organizerLogin);

router.post("/verifyOrganizerOtp", verifyOrganizerOtp)

// // Forgot password
// router.post("/forgot-password", authController.forgotPassword);

// // Verify OTP
// router.post("/verify-otp", authController.verifyOtp);

// // Reset password
// router.post("/reset-password", authController.resetPassword);

module.exports = router;