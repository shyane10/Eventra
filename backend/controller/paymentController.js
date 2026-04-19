const axios = require("axios");
const Booking = require("../models/bookingModel");
const Order = require("../models/orderModel");
const Event = require("../models/eventModel");
const Product = require("../models/product");
const Revenue = require("../models/revenueModel");
const SystemConfig = require("../models/systemConfigModel");

// Helper to handle revenue record creation
const recordRevenue = async (type, record, amount) => {
  try {
    let config = await SystemConfig.findOne();
    const commissionRate = config ? config.adminCommissionRate : 30;
    
    const adminAmount = (amount * commissionRate) / 100;
    const organizerAmount = amount - adminAmount;

    await Revenue.create({
      type,
      referenceId: record._id,
      totalAmount: amount,
      adminShare: adminAmount,
      organizerShare: organizerAmount,
      commissionRate: commissionRate
    });
    console.log(`💰 Revenue recorded for ${type}: Admin(${adminAmount}), Org(${organizerAmount})`);
  } catch (err) {
    console.error("Revenue recording failed:", err.message);
  }
};

// 1. Initiate Khalti Payment
exports.initiateKhaltiPayment = async (req, res) => {
  try {
    const { amount, eventId, quantity, purchase_order_name, purchaseType, cartItems } = req.body;
    const userId = req.user.id;

    let purchaseRecord;

    if (purchaseType === "product") {
       purchaseRecord = await Order.create({
         user: userId,
         items: cartItems.map(item => ({
            product: item._id,
            quantity: item.quantity,
            price: item.price
         })),
         totalPaid: amount,
         status: "Pending"
       });
    } else {
       purchaseRecord = await Booking.create({
         user: userId,
         event: eventId,
         quantity,
         totalPaid: amount,
         status: "Pending"
       });
    }

    const response = await axios.post(
      process.env.KHALTI_GATEWAY_URL,
      {
        return_url: "http://localhost:5173/payment-success", 
        website_url: "http://localhost:5173",
        amount: Math.round(amount * 100), 
        purchase_order_id: purchaseRecord._id,
        purchase_order_name: purchase_order_name || `Purchase for ${userId}`,
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    if (response.data && response.data.pidx) {
        purchaseRecord.khalti_pidx = response.data.pidx;
        await purchaseRecord.save();
        
        res.json({
            success: true,
            payment_url: response.data.payment_url,
            pidx: response.data.pidx
        });
    } else {
        res.status(400).json({ success: false, message: "Failed to initialize Khalti" });
    }
  } catch (error) {
    console.error("Khalti Init Error:", error.response?.data || error.message);
    res.status(500).json({ 
        success: false, 
        message: "Khalti Initiation Failed", 
        error: error.response?.data || error.message 
    });
  }
};

// 2. Verify Khalti Payment
exports.verifyKhaltiPayment = async (req, res) => {
  const { pidx } = req.body;

  try {
    console.log("🔍 Verifying Khalti Payment for pidx:", pidx);

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status === "Completed") {
      // 1. Try finding in Bookings
      let purchaseRecord = await Booking.findOne({ khalti_pidx: pidx });
      
      if (purchaseRecord) {
        purchaseRecord.status = "Confirmed";
        purchaseRecord.transactionId = response.data.transaction_id;
        await purchaseRecord.save();

        const event = await Event.findById(purchaseRecord.event);
        if (event && event.availableTickets !== undefined) {
           event.availableTickets -= purchaseRecord.quantity;
           await event.save();
        }

        // RECORD REVENUE
        await recordRevenue("Booking", purchaseRecord, purchaseRecord.totalPaid);

        return res.json({ success: true, message: "Booking Verified", booking: purchaseRecord });
      }

      // 2. Try finding in Orders
      purchaseRecord = await Order.findOne({ khalti_pidx: pidx });
      if (purchaseRecord) {
        purchaseRecord.status = "Confirmed"; 
        purchaseRecord.transactionId = response.data.transaction_id;
        await purchaseRecord.save();

        // RECORD REVENUE
        await recordRevenue("Order", purchaseRecord, purchaseRecord.totalPaid);

        return res.json({ success: true, message: "Order Verified", order: purchaseRecord });
      }

      return res.status(404).json({ success: false, message: "Purchase record not found" });
    } else {
      res.status(400).json({ success: false, message: `Payment Status: ${response.data.status}` });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Verification Error", error: error.message });
  }
};

// 3. Generate Bill/Invoice Data
exports.getInvoiceData = async (req, res) => {
    try {
        const { id, type } = req.params;
        let purchase;
        if (type === "Order") {
            purchase = await Order.findById(id).populate("user").populate("items.product");
        } else {
            purchase = await Booking.findById(id).populate("user").populate("event");
        }

        if (!purchase) return res.status(404).json({ message: "Record not found" });

        res.status(200).json({ success: true, invoice: purchase });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch invoice", error: err.message });
    }
};