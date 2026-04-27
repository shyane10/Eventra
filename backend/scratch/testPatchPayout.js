const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const PayoutRequest = require("../models/payoutRequestModel");
const axios = require("axios");

const testPatch = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const admin = await User.findOne({ isAdmin: true }) || await User.findOne({});
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        const req = await PayoutRequest.findOne();
        if (!req) {
            console.log("No payout request found");
            process.exit(0);
        }

        console.log(`Testing PATCH for ID: ${req._id}`);
        try {
            const res = await axios.patch(`http://localhost:5000/api/admin/payouts/${req._id}`, 
                { status: "Approved" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log("Success:", res.data);
        } catch (err) {
            console.error("Failed:", err.response?.status, err.response?.data || err.message);
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
testPatch();
