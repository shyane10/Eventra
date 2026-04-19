const express = require("express");
const { 
    verifyOtp, 
    userRegister, 
    userLogin, 
    logout, 
    forgotPassword, 
    resetPassword,
    sendContactEmail
} = require("../controller/auth/authController");
const router = express.Router();

// ====== User Auth Routes ======
router.post("/userRegister", userRegister);
router.post("/verifyOtp", verifyOtp);
router.post("/userLogin", userLogin);
router.post("/logout", logout);

// Forgot Password Routes
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

// Contact Route
router.post("/contact", sendContactEmail);

module.exports = router;