const express = require("express");
const {login, verifyOtp, registerRequest } = require("../controller/auth/authController");
const router = express.Router();


// ====== User Auth Routes ======

// Register a new user
// router.post("/register", authController.userRegister);
router.route("/userRegister").post(registerRequest);

router.route("/verifyOtp").post(verifyOtp);

router.route("/userLogin").post(login);




// // Forgot password
// router.post("/forgot-password", authController.forgotPassword);

// // Verify OTP
// router.post("/verify-otp", authController.verifyOtp);

// // Reset password
// router.post("/reset-password", authController.resetPassword);

module.exports = router;