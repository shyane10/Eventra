const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const Event = require("../models/eventModel");
const Revenue = require("../models/revenueModel");
const PayoutRequest = require("../models/payoutRequestModel");

const test = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const payoutTest = await PayoutRequest.find().catch(e => "Payout Error: " + e.message);
        console.log("Payout length:", Array.isArray(payoutTest) ? payoutTest.length : payoutTest);

        const revTest = await Revenue.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]).catch(e => "Rev Error: " + e.message);
        console.log("Rev Test:", revTest);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
test();
