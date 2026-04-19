const express = require("express");
const router = express.Router();
const { 
  createBooking, 
  createOrder, 
  getUserHistory, 
  getOrganizerAttendees,
  getOrganizerRevenueData,
  getOrganizerStats 
} = require("../controller/historyController");
const { verifyToken, isOrganizer } = require("../middlewear/authorization");

// --- CUSTOMER ROUTES ---
router.post("/booking", verifyToken, createBooking);
router.post("/order", verifyToken, createOrder);
router.get("/my-history", verifyToken, getUserHistory);

// --- ORGANIZER ROUTES ---
router.get("/attendees", verifyToken, isOrganizer, getOrganizerAttendees);
router.get("/revenue-analytics", verifyToken, isOrganizer, getOrganizerRevenueData);
router.get("/organizer-stats", verifyToken, isOrganizer, getOrganizerStats);

module.exports = router;
