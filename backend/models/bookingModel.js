const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  totalPaid: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Confirmed", "Cancelled", "Pending"],
    default: "Pending",
  },
  khalti_pidx: {
    type: String
  },
  transactionId: {
    type: String
  },
  paymentMethod: {
    type: String,
    default: "Khalti",
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
