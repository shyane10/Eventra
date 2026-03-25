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
    unique: true
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
  isOtpVerified: {
    type: Boolean,
    default: false
  }
});

const Organizer = mongoose.model('Organizer', organizerSchema);
module.exports = Organizer;