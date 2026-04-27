const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const Booking = require("../models/bookingModel");
const Order = require("../models/orderModel");

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const bookings = await Booking.find({});
        const orders = await Order.find({});
        console.log("BOOKINGS:", JSON.stringify(bookings, null, 2));
        console.log("ORDERS:", JSON.stringify(orders, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkData();
