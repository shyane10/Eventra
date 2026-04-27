const PayoutRequest = require("../models/payoutRequestModel");
const Booking = require("../models/bookingModel");
const Order = require("../models/orderModel");
const Event = require("../models/eventModel");
const Product = require("../models/product");

// 1. Organizer requests a payout
exports.requestPayout = async (req, res) => {
  try {
    const { amount } = req.body;
    const organizerId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const newRequest = await PayoutRequest.create({
      organizer: organizerId,
      amount,
      status: "Pending"
    });

    res.status(201).json({ success: true, message: "Payout request submitted!", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit request", error: error.message });
  }
};

// 2. Admin gets all payout requests
exports.getAllPayoutRequests = async (req, res) => {
  try {
    const requests = await PayoutRequest.find().populate("organizer", "organizerName organizerEmail").sort({ requestedAt: -1 });
    res.status(200).json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
};

// 3. Admin updates payout status (Approve/Reject)
exports.updatePayoutStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await PayoutRequest.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    
    if (!request) return res.status(404).json({ message: "Request not found" });

    res.status(200).json({ success: true, message: `Request ${status}`, request });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 4. Organizer gets their own request history
exports.getMyPayoutRequests = async (req, res) => {
    try {
        const requests = await PayoutRequest.find({ organizer: req.user.id }).sort({ requestedAt: -1 });
        res.status(200).json({ success: true, requests });
    } catch (err) {
        res.status(500).json({ message: "Fetch failed", error: err.message });
    }
};
