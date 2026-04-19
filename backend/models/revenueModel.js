const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Booking", "Order"],
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'type',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  adminShare: {
    type: Number,
    required: true
  },
  organizerShare: {
    type: Number,
    required: true
  },
  commissionRate: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Completed"
  }
}, { timestamps: true });

module.exports = mongoose.model("Revenue", revenueSchema);
