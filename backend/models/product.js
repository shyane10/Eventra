const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Clothing", "Accessories", "Posters", "Digital"], // Restricts to these options
    default: "Clothing"
  },
  image: {
    type: String, // Stores the URL of the image
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5.0
  },
  // Link this product to an Organizer/User
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  }
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;