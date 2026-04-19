const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }));
    const Organizer = mongoose.model("Organizer", new mongoose.Schema({}, { strict: false }));

    console.log("Dropping all indexes on users collection...");
    try {
        await mongoose.connection.db.collection("users").dropIndexes();
        console.log("Successfully dropped indexes for users.");
    } catch (e) {
        console.log("No indexes found or error dropping for users:", e.message);
    }

    console.log("Dropping all indexes on organizers collection...");
    try {
        await mongoose.connection.db.collection("organizers").dropIndexes();
        console.log("Successfully dropped indexes for organizers.");
    } catch (e) {
        console.log("No indexes found or error dropping for organizers:", e.message);
    }

    console.log("Done! Mongoose will recreate the correct indexes next time you start your app.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
};

fixIndexes();
