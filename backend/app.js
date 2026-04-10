const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/databaseConnection");
const cors = require("cors");

// --- ROUTE IMPORTS ---
const organizerRoute = require("./routes/organizerRoutes");
const userRoute = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const productRouter = require("./routes/productRoute"); // Router import gareko

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- ROUTE DEFINITIONS (Direct Routes) ---

app.use("", userRoute);
app.use("", organizerRoute);
app.use("", eventRouter);
app.use("", productRouter); // This will/add, /update/

app.get("/", (req, res) => {
  res.send("Welcome to Eventra API");
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);