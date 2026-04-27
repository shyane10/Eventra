const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const Event = require("../models/eventModel");

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const events = await Event.find({});
        console.log("ALL EVENTS IN DB:", JSON.stringify(events, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkData();
