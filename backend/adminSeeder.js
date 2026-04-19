const User = require("./models/userModel");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminEmail = "eventra121@gmail.com";
    
    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("1234567", 10);
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isEmailVerified: true,
      });
      console.log("✅ Admin user seeded successfully!");
    } else {
      // FORCE Ensure the role is admin even if they registered as a user before
      existingAdmin.role = "admin";
      await existingAdmin.save();
      console.log("ℹ️ Admin already exists - Role verified as 'admin'.");
    }
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  }
};

module.exports = seedAdmin; // This must be here!