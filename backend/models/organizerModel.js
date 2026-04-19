const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const organizerSchema = new Schema({
  organizerName: {
    type: String,
    required: true
  },
  organizerEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  venue: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: Number,
    required: true
  },
  otp: {
    type: Number
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active"
  }
});

const Organizer = mongoose.model('Organizer', organizerSchema);
module.exports = Organizer;