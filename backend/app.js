const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const connectDB = require("./database/databaseConnection");
const seedAdmin = require("./adminSeeder")

// 1. Load environment variables
dotenv.config();

// 2. Global Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
});

// 3. Initialize App and Database
const app = express();
connectDB();
seedAdmin();

// 4. Route Imports
const organizerRoute = require("./routes/organizerRoutes");
const userRoute = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const productRouter = require("./routes/productRoute");
const historyRouter = require("./routes/historyRoutes");
const adminRouter = require("./routes/adminRoutes");
const paymentRouter = require("./routes/paymentRoutes");


// 5. Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// 6. Route Definitions
app.use("/api/auth", userRoute);
app.use("/api/organizer", organizerRoute);
app.use("/api/events", eventRouter);
app.use("/api/products", productRouter);
app.use("/api/history", historyRouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("🚀 Eventra API is running smoothly!");
});

// Catch-all for unknown routes (404)
app.use((req, res, next) => {
  console.log(`🔍 404 NOT FOUND: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});

// 7. Server Start
const PORT = process.env.PORT || 5000;
// Final Error Middleware to stop [object Object]
app.use((err, req, res, next) => {
  console.log("🚨 --- RAW SYSTEM ERROR --- 🚨");
  console.dir(err); // This prints the object without converting to [object Object]
  res.status(500).json({ error: err.message });
});
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);