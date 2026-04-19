const express = require("express");
const router = express.Router();

// Import your controllers
const adminController = require("../controller/adminController");

// Import Middleware
const { verifyToken, isAdmin } = require("../middlewear/authorization");

// --- DASHBOARD STATS ---
// GET /api/admin/stats
router.get("/stats", verifyToken, isAdmin, adminController.getAdminStats);

// GET /api/admin/chart-data
router.get("/chart-data", verifyToken, isAdmin, adminController.getRevenueChartData);

// --- EVENT MANAGEMENT ---
// GET /api/admin/events (Fetch all events with organizer details)
router.get("/events", verifyToken, isAdmin, adminController.getAllEvents);

// DELETE /api/admin/events/:id (Force delete an event)
router.delete("/events/:id", verifyToken, isAdmin, adminController.deleteEvent);

// --- USER MANAGEMENT ---
// GET /api/admin/users
router.get("/users", verifyToken, isAdmin, adminController.getAllUsers);

// PATCH /api/admin/users/block/:id (Optional: Block a user)
router.patch("/users/block/:id", verifyToken, isAdmin, adminController.toggleUserStatus);

// --- ORGANIZER MANAGEMENT ---
// GET /api/admin/organizers
router.get("/organizers", verifyToken, isAdmin, adminController.getAllOrganizers);

// --- CONFIG MANAGEMENT ---
// PUT /api/admin/config
router.put("/config", verifyToken, isAdmin, adminController.updateSystemConfig);

// --- REPORT GENERATION ---
// GET /api/admin/report
router.get("/report", verifyToken, isAdmin, adminController.getReportData);

module.exports = router;