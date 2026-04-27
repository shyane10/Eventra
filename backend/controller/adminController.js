const Event = require("../models/eventModel");
const User = require("../models/userModel");
const Organizer = require("../models/organizerModel");
const SystemConfig = require("../models/systemConfigModel");
const Revenue = require("../models/revenueModel");
const Booking = require("../models/bookingModel");
const Order = require("../models/orderModel");
const Product = require("../models/product");

// Helper to sync past data without blocking the main request too much
const syncLegacyData = async (commissionRate) => {
  try {
    const confirmedBookings = await Booking.find({ status: "Confirmed" });
    const confirmedOrders = await Order.find({ status: "Confirmed" });

    for (const b of confirmedBookings) {
      const exists = await Revenue.findOne({ referenceId: b._id });
      if (!exists) {
        await Revenue.create({
          type: "Booking",
          referenceId: b._id,
          totalAmount: b.totalPaid,
          adminShare: (b.totalPaid * commissionRate) / 100,
          organizerShare: b.totalPaid - ((b.totalPaid * commissionRate) / 100),
          commissionRate: commissionRate
        });
      }
    }

    for (const o of confirmedOrders) {
      const exists = await Revenue.findOne({ referenceId: o._id });
      if (!exists) {
        await Revenue.create({
          type: "Order",
          referenceId: o._id,
          totalAmount: o.totalPaid,
          adminShare: (o.totalPaid * commissionRate) / 100,
          organizerShare: o.totalPaid - ((o.totalPaid * commissionRate) / 100),
          commissionRate: commissionRate
        });
      }
    }
  } catch (err) {
    console.error("Sync Legacy Data Error:", err.message);
  }
};

exports.getAdminStats = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) config = await SystemConfig.create({ adminCommissionRate: 30 });
    
    // Trigger sync but don't strictly wait for it to complete if it's too large
    // (For demo purposes, we'll wait since it's likely small data)
    await syncLegacyData(config.adminCommissionRate);

    // 1. Concurrent counts
    const [totalUsers, totalOrganizers, activeEvents] = await Promise.all([
      User.countDocuments(),
      Organizer.countDocuments(),
      Event.countDocuments({ status: "Approved" })
    ]);

    // 2. Financial Aggregate
    const financialStats = await Revenue.aggregate([
      { 
        $group: { 
          _id: null, 
          totalPlatformRevenue: { $sum: "$totalAmount" },
          totalAdminRevenue: { $sum: "$adminShare" }
        } 
      }
    ]);

    const totalRevenue = financialStats[0]?.totalPlatformRevenue || 0;
    const adminRevenue = financialStats[0]?.totalAdminRevenue || 0;

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue: `रू ${totalRevenue.toLocaleString()}`,
        adminRevenue: `रू ${adminRevenue.toLocaleString()}`,
        commissionRate: config.adminCommissionRate.toString(),
        activeEvents: activeEvents.toString(),
        totalUsers: (totalUsers + totalOrganizers).toString(),
        totalOrganizers: totalOrganizers.toString(),
        uptime: "99.9%"
      }
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    res.status(500).json({ message: "Error fetching stats", error: error.message });
  }
};

// --- CHART DATA ---
exports.getRevenueChartData = async (req, res) => {
    try {
        // Aggregate revenue by day for the last 7 days
        const chartData = await Revenue.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    revenue: { $sum: "$totalAmount" },
                    profit: { $sum: "$adminShare" }
                }
            },
            { $sort: { "_id": 1 } },
            { $limit: 7 }
        ]);

        // Format for Recharts
        const formattedData = chartData.map(d => ({
            name: new Date(d._id).toLocaleDateString('en-US', { weekday: 'short' }),
            revenue: d.revenue,
            profit: d.profit
        }));

        res.status(200).json({ success: true, chartData: formattedData });
    } catch (error) {
        res.status(500).json({ message: "Error fetching chart data", error: error.message });
    }
};

// --- CONFIG MANAGEMENT ---
exports.updateSystemConfig = async (req, res) => {
  try {
    const { adminCommissionRate } = req.body;
    
    if (adminCommissionRate === undefined || isNaN(adminCommissionRate)) {
        return res.status(400).json({ message: "Valid commission rate is required" });
    }

    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig({ adminCommissionRate });
    } else {
      config.adminCommissionRate = adminCommissionRate;
    }
    
    config.lastUpdated = Date.now();
    await config.save();
    
    res.status(200).json({ success: true, message: "Configuration updated successfully", config });
  } catch (error) {
    console.error("Update Config Error:", error);
    res.status(500).json({ message: "Internal server error while updating config", error: error.message });
  }
};

// --- EVENT MANAGEMENT ---
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
};

exports.updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const event = await Event.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ success: true, message: `Event status updated to ${status}`, event });
  } catch (error) {
    res.status(500).json({ message: "Error updating event status", error: error.message });
  }
};

// --- PRODUCT MANAGEMENT ---
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.updateProductStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ success: true, message: `Product status updated to ${status}`, product });
  } catch (error) {
    res.status(500).json({ message: "Error updating product status", error: error.message });
  }
};




// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    user.status = user.status === "blocked" ? "active" : "blocked";
    await user.save();
    
    res.status(200).json({ success: true, message: `User ${user.status} successfully` });
  } catch (error) {
    res.status(500).json({ message: "Error toggling user status", error: error.message });
  }
};

// --- ORGANIZER MANAGEMENT ---
exports.getAllOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, organizers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching organizers", error: error.message });
  }
};

// --- REPORT GENERATION ---
exports.getReportData = async (req, res) => {
  try {
    const bookings = await Booking.find({ status: "Confirmed" })
      .populate("user", "name email")
      .populate("event", "title");
    
    const orders = await Order.find({ status: "Confirmed" })
      .populate("user", "name email")
      .populate("items.product", "name");

    let config = await SystemConfig.findOne();
    const commissionRate = config ? config.adminCommissionRate : 30;

    res.status(200).json({ 
      success: true, 
      report: {
        bookings,
        orders,
        commissionRate
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error generating report data", error: error.message });
  }
};