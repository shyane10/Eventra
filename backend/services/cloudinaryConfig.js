const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// 1. Force load the .env file immediately upon import
// This fixes the "Must supply api_key" regardless of import order in app.js
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// 2. Extra safety: Check if variables exist before configuring
if (!process.env.CLOUDINARY_API_KEY) {
  // If we still don't have it, try loading from the current folder
  require('dotenv').config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : undefined,
  api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : undefined,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "eventra_products",
    // ADD 'webp' TO THIS ARRAY
    allowed_formats: ["jpg", "png", "jpeg", "webp"], 
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };