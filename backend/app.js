const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/databaseConnection");
const cors = require("cors");
const organizerRoute = require("./routes/organizerRoutes");
const userRoute = require("./routes/userRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // EXACTLY match your frontend URL (no trailing slash)
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json()); // Essential: allows reading JSON from req.body

// Route Definitions
// All user-related routes will be prefixed with /api/users
app.use("", userRoute);

// All organizer-related routes will be prefixed with /api/organizers
app.use("", organizerRoute);

app.get("/", (req, res) => {
  res.send("Welcome to Eventra API");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);