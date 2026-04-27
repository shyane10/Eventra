const express = require("express");
const router = express.Router();
const { 
  createBooking, 
  createOrder, 
  getUserHistory, 
  getOrganizerAttendees,
  getOrganizerRevenueData,
  getOrganizerStats,
  requestPayout,
  getMyPayoutRequests
} = require("../controller/historyController");
const { requestPayout: submitPayout, getMyPayoutRequests: fetchMyPayouts } = require("../controller/payoutController");

const { verifyToken, isOrganizer } = require("../middlewear/authorization");

// --- CUSTOMER ROUTES ---
router.post("/booking", verifyToken, createBooking);
router.post("/order", verifyToken, createOrder);
router.get("/my-history", verifyToken, getUserHistory);

// --- ORGANIZER ROUTES ---
router.get("/attendees", verifyToken, isOrganizer, getOrganizerAttendees);
router.get("/revenue-analytics", verifyToken, isOrganizer, getOrganizerRevenueData);
router.get("/organizer-stats", verifyToken, isOrganizer, getOrganizerStats);
router.post("/request-payout", verifyToken, isOrganizer, submitPayout);
router.get("/my-payouts", verifyToken, isOrganizer, fetchMyPayouts);


module.exports = router;
