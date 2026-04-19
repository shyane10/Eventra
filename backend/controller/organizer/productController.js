const Product = require("../../models/product");

// 1. ADD PRODUCT
exports.addProduct = async (req, res) => {
  try {
    // 1. Debug Logs (Check terminal to see what is arriving)
    console.log("--- New Product Request ---");
    console.log("Body Data:", req.body);
    console.log("File Data:", req.file ? "Image Received" : "NO IMAGE");

    const { name, artist, price, category, description, stock, rating, organizerId } = req.body;

    // 2. Validate Image Upload
    // If req.file is missing, Multer failed or the key name 'image' didn't match
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Image upload failed. Please ensure you selected a valid image file." 
      });
    }

    const imagePath = req.file.path; // This is the Cloudinary URL

    // 3. Validate Required Fields
    if (!name || !artist || !price || !organizerId) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields: Name, Artist, Price, and OrganizerID are mandatory." 
      });
    }

    // 4. Create Product Instance
    const newProduct = new Product({
      name,
      artist,
      price: Number(price), // Convert string from FormData to Number
      category: category || "Clothing",
      image: imagePath,
      description: description || "",
      stock: Number(stock || 0),
      rating: Number(rating || 5.0),
      organizerId: organizerId // Ensure this is a valid MongoDB ObjectId string
    });

    // 5. Save to MongoDB
    const savedProduct = await newProduct.save();

    console.log("✅ Product Saved Successfully");
    res.status(201).json({ 
      success: true, 
      data: savedProduct 
    });

  } catch (error) {
    // THIS PART FIXES THE [object Object] LOGGING
    console.log("❌ ADD PRODUCT ERROR:");
    console.error(error); // This will show the full stack trace in your terminal
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      detail: error // This sends the full error object to the frontend Network tab
    });
  }
};

// 2. GET ALL PRODUCTS (Global Shop)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET ORGANIZER'S PRODUCTS (Dashboard)
exports.getProductsByOrganizer = async (req, res) => {
  try {
    const products = await Product.find({ organizerId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    // Start with existing body data
    let updateData = { ...req.body };

    // If a new file is uploaded, update the image URL from Cloudinary
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ 
      success: true, 
      message: "Product updated successfully!", 
      data: updatedProduct 
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 5. DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};