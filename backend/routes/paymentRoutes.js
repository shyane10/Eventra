const express = require("express");
const router = express.Router();
const paymentController = require("../controller/paymentController");
const { verifyToken } = require("../middlewear/authorization");

// Using verifyToken instead of non-existent authMiddleware
router.post("/initialize", verifyToken, paymentController.initiateKhaltiPayment);
router.post("/verify", verifyToken, paymentController.verifyKhaltiPayment);
router.get("/invoice/:type/:id", verifyToken, paymentController.getInvoiceData);

module.exports = router;
