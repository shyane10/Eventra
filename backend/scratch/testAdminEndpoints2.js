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
        
        const endpoints = [
            "/api/admin/stats",
            "/api/admin/events",
            "/api/admin/users",
            "/api/admin/organizers",
            "/api/admin/products",
            "/api/admin/chart-data",
            "/api/admin/payouts"
        ];
        
        for (const ep of endpoints) {
            try {
                const res = await axios.get(`http://localhost:5000${ep}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`Success ${ep}:`, Object.keys(res.data));
            } catch (err) {
                console.error(`ERROR ${ep}:`, err.response?.status, err.response?.data || err.message);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
testAll();
