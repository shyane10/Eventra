const express = require("express");
const router = express.Router();

// 1. Import the pre-configured upload middleware from your central config
// This ensures Cloudinary is already configured before the route is called
const { upload } = require("../services/cloudinaryConfig");

// 2. Import Controller functions
const { 
    addProduct, 
    updateProduct, 
    getProducts, 
    getProductsByOrganizer, 
    deleteProduct 
} = require("../controller/organizer/productController");

// --- ROUTES ---

// @route   POST /add
// Using upload.single("image") matches the key 'image' in your Frontend FormData
router.post("/add", upload.single("image"), addProduct);

// @route   PUT /update/:id
router.put("/update/:id", upload.single("image"), updateProduct);

// @route   GET /
router.get("/", getProducts);

// @route   GET /organizer/:id
router.get("/organizer/:id", getProductsByOrganizer);

// @route   DELETE /delete/:id
router.delete("/delete/:id", deleteProduct);

module.exports = router;