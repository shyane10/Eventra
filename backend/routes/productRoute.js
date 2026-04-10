const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { addProduct, updateProduct, getProducts, getProductsByOrganizer, deleteProduct } = require("../controller/organizer/productController");

// --- CLOUDINARY CONFIG ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eventra_products", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage: storage });

// --- ROUTES ---
router.post("/add", upload.single("image"), addProduct);
router.put("/update/:id", upload.single("image"), updateProduct);
router.get("/", getProducts);
router.get("/organizer/:id", getProductsByOrganizer);
router.delete("/delete/:id", deleteProduct);

module.exports = router;