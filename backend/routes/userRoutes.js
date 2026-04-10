const express = require("express");
const { 
    verifyOtp, 
    userRegister, 
    userLogin, 
    logout, 
    forgotPassword, 
    resetPassword 
} = require("../controller/auth/authController");
const router = express.Router();

// ====== User Auth Routes ======
router.route("/userRegister").post(userRegister);
router.route("/verifyOtp").post(verifyOtp);
router.route("/userLogin").post(userLogin);
router.route("/logout").post(logout);

// Forgot Password Routes
router.route("/forgotPassword").post(forgotPassword);
router.route("/resetPassword").post(resetPassword);

module.exports = router;