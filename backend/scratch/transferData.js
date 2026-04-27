const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const Event = require("../models/eventModel");
const Product = require("../models/product");
const Order = require("../models/orderModel");

const transferData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        // Target Organizer: khanalsuvam28@gmail.com
        const targetId = "69e498d101df8c7b57e7ac30";
        
        // Transfer all events and products to this organizer
        const eventRes = await Event.updateMany({}, { organizer: targetId, organizerId: targetId });
        const productRes = await Product.updateMany({}, { organizer: targetId, organizerId: targetId });
        
        console.log(`Transferred ${eventRes.modifiedCount} events and ${productRes.modifiedCount} products to khanalsuvam28@gmail.com.`);
        
        process.exit(0);
    } catch (err) {
        console.error("Transfer failed:", err);
        process.exit(1);
    }
};
transferData();
