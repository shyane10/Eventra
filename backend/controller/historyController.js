const Booking = require("../models/bookingModel");
const Order = require("../models/orderModel");
const Event = require("../models/eventModel");
const Product = require("../models/product");

// 1. Create a Booking (Event Ticket)
exports.createBooking = async (req, res) => {
  try {
    const { event, quantity, totalPaid } = req.body;
    const userId = req.user.id;

    // Optional: Check if event has available tickets
    const targetEvent = await Event.findById(event);
    if (!targetEvent) return res.status(404).json({ success: false, message: "Event not found" });

    // Assuming we do not subtract tickets if it's unlimited, or we can subtract here
    if (targetEvent.availableTickets !== undefined && targetEvent.availableTickets < quantity) {
        return res.status(400).json({ success: false, message: "Not enough tickets available" });
    }

    const booking = await Booking.create({
      user: userId,
      event,
      quantity,
      totalPaid
    });

    if (targetEvent.availableTickets !== undefined) {
      targetEvent.availableTickets -= quantity;
      await targetEvent.save();
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Booking failed", error: error.message });
  }
};

// 2. Create an Order (Shop Merchandise)
exports.createOrder = async (req, res) => {
  try {
    const { items, totalPaid } = req.body;
    const userId = req.user.id;

    const order = await Order.create({
      user: userId,
      items,
      totalPaid
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Order failed", error: error.message });
  }
};

// 3. Get User's History (For Customer Dashboard)
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ user: userId })
      .populate("event")
      .sort({ createdAt: -1 });

    const orders = await Order.find({ user: userId })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch history failed", error: error.message });
  }
};

// 4. Get Attendees for an Organizer (For Organizer Dashboard)
exports.getOrganizerAttendees = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // Find all events owned by this organizer
    const myEvents = await Event.find({ organizer: organizerId }).select("_id title");
    const eventIds = myEvents.map(e => e._id);

    // Find bookings for all these events (Only Confirmed ones)
    const bookings = await Booking.find({ 
      event: { $in: eventIds },
      status: "Confirmed" // Only show actual paid bookings
    })
      .populate("user", "name email")
      .populate("event", "title startDate")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, attendees: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch attendees failed", error: error.message });
  }
};

// 5. Get Comprehensive Revenue Data (For Graph)
exports.getOrganizerRevenueData = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // A. Get Revenue from Event Bookings
    const myEvents = await Event.find({ organizer: organizerId }).select("_id");
    const eventIds = myEvents.map(e => e._id);
    const bookings = await Booking.find({ 
      event: { $in: eventIds }, 
      status: "Confirmed" 
    }).select("totalPaid createdAt");

    // B. Get Revenue from Product Orders
    // This is trickier because an order might have products from multiple organizers
    // But for this simple system, we look for items belonging to this organizer
    const myProducts = await Product.find({ organizerId: organizerId }).select("_id");
    const productIds = myProducts.map(p => p._id.toString());
    
    const allOrders = await Order.find({ status: "Confirmed" }).populate("items.product");
    
    // Filter orders to only count revenue from THIS organizer's products
    let productRevenueByDate = [];
    allOrders.forEach(order => {
        let organizerTotalForThisOrder = 0;
        order.items.forEach(item => {
            if (productIds.includes(item.product?._id.toString())) {
                organizerTotalForThisOrder += (item.price * item.quantity);
            }
        });
        if (organizerTotalForThisOrder > 0) {
            productRevenueByDate.push({
                totalPaid: organizerTotalForThisOrder,
                createdAt: order.createdAt
            });
        }
    });

    // Combine and Sort by Date for Graph
    const combinedData = [
       ...bookings.map(b => ({ amount: b.totalPaid, date: b.createdAt })),
       ...productRevenueByDate.map(p => ({ amount: p.totalPaid, date: p.createdAt }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    res.status(200).json({ success: true, data: combinedData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch revenue analytics failed", error: error.message });
  }
};

// 6. Get Detailed Organizer Stats (Counts & Totals)
exports.getOrganizerStats = async (req, res) => {
  try {
    const organizerId = req.user.id;

    // A. Event Stats
    const myEvents = await Event.find({ organizer: organizerId }).select("_id");
    const eventIds = myEvents.map(e => e._id);
    
    const bookings = await Booking.find({ 
      event: { $in: eventIds }, 
      status: "Confirmed" 
    });
    
    const ticketRevenue = bookings.reduce((sum, b) => sum + b.totalPaid, 0);
    const totalAttendees = bookings.reduce((sum, b) => sum + b.quantity, 0);

    // B. Product Stats
    const myProducts = await Product.find({ organizerId: organizerId }).select("_id");
    const productIds = myProducts.map(p => p._id.toString());
    
    const allOrders = await Order.find({ status: "Confirmed" }).populate("items.product");
    
    let productRevenue = 0;
    let productsSold = 0;

    allOrders.forEach(order => {
        order.items.forEach(item => {
            if (productIds.includes(item.product?._id.toString())) {
                productRevenue += (item.price * item.quantity);
                productsSold += item.quantity;
            }
        });
    });

    res.status(200).json({ 
      success: true, 
      stats: {
        ticketRevenue,
        productRevenue,
        totalRevenue: ticketRevenue + productRevenue,
        totalAttendees,
        productsSold,
        eventCount: myEvents.length
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Fetch organizer stats failed", error: error.message });
  }
};
