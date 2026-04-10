const Product = require("../organizer/productController"); // Ensure path and casing match your file name

const addProduct = async (req, res) => {
  try {
    const { name, artist, price, category, image, description, stock, rating } = req.body;

    // Basic validation
    if (!name || !artist || !price || !category || !image) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newProduct = new Product({
      name,
      artist,
      price,
      category,
      image,
      description,
      stock,
      rating: rating || 5.0,
      // Priority: 1. Auth middleware user ID, 2. Manual body ID (for testing)
      organizerId: req.user ? req.user.id : req.body.organizerId, 
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, data: savedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all products (Global)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get products for a specific organizer
// @route   GET /api/products/organizer/:id
const getProductsByOrganizer = async (req, res) => {
  try {
    const products = await Product.find({ organizerId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/update/:id
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/delete/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductsByOrganizer, // Exported this new function
  updateProduct,
  deleteProduct,
};
