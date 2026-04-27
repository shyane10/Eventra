const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const axios = require("axios");

const testAll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ isAdmin: true }) || await User.findOne({});
        // create token
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        console.log("Token generated.");
        
        try {
            const results = await Promise.all([
                axios.get("http://localhost:5000/api/admin/stats", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:5000/api/admin/events", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:5000/api/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:5000/api/admin/organizers", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:5000/api/admin/products", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:5000/api/admin/chart-data", { headers: { Authorization: `Bearer ${token}` } }),
                axios.get("http://localhost:5000/api/admin/payouts", { headers: { Authorization: `Bearer ${token}` } })
            ]);
            console.log("All Promises succeed!");
        } catch (err) {
            console.error("Promise.all failed:", err.response?.status, err.response?.config?.url, err.response?.data || err.message);
        }
        process.exit(0);
    } catch (err) {
        console.error("Setup error:", err);
        process.exit(1);
    }
};
testAll();
