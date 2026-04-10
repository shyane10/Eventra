const express = require("express");
const router = express.Router();

// 1. Ensure these names match the "exports.name" in your controller file
const { 
  createEvent, 
  updateEvent, 
  deleteEvent, 
  getOrganizerEvents, 
  getAllEvents 
} = require("../controller/event/eventController");

// 2. Ensure these match the "exports.name" in your middleware file
const { verifyToken, isOrganizer } = require("../middlewear/authorization");
const { upload } = require("../services/cloudinaryConfig");

// Public Route
router.get("/all", getAllEvents);

// In eventRoutes.js
router.post(
  "/createEvent", 
  verifyToken, 
  isOrganizer, 
  upload.single("eventImage"), // This string MUST match what the frontend sends
  createEvent
);

router.put("/updateEvent/:id", verifyToken, isOrganizer, updateEvent);
router.delete("/deleteEvent/:id", verifyToken, isOrganizer, deleteEvent);
router.get("/my-events", verifyToken, isOrganizer, getOrganizerEvents);

module.exports = router;