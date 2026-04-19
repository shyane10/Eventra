// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set('debug', true); // Added to trace all DB operations
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;