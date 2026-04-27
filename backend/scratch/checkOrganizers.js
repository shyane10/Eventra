const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: path.join(__dirname, "../.env") });
const Organizer = require("../models/organizerModel");

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const organizers = await Organizer.find({});
        console.log("ORGANIZERS:", JSON.stringify(organizers, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
checkData();
