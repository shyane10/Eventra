const mongoose = require("mongoose");

const systemConfigSchema = new mongoose.Schema({
  adminCommissionRate: {
    type: Number,
    default: 30, // Default 30%
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

const SystemConfig = mongoose.model("SystemConfig", systemConfigSchema);
module.exports = SystemConfig;
