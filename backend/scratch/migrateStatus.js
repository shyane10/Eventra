const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

// Load backend env
dotenv.config({ path: path.join(__dirname, "../.env") });

const Event = require("../models/eventModel");

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for migration...");

        const result = await Event.updateMany(
            { status: { $in: ["Published", "Published"] } }, // Handle case sensitive or old values
            { $set: { status: "Approved" } }
        );

        console.log(`Updated ${result.modifiedCount} events from Published to Approved.`);
        
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
