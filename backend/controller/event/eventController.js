const Event = require("../../models/eventModel");

// 1. CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    const organizerId = req.user.id; 

    // Destructure everything from body
    const { 
      title, description, category, startDate, endDate, 
      locationType, venueName, address, totalCapacity, 
      ticketPrice, isFree 
    } = req.body;

    // 1. Validation
    if (!title || !startDate || !endDate || !totalCapacity) {
      return res.status(400).json({ 
        success: false,
        message: "Required fields (Title, Dates, Capacity) are missing." 
      });
    }

    // 2. Handle Image path
    const eventImage = req.file ? req.file.path : "default-event.jpg";

    // 3. Create the Event (Manually mapping to ensure correct types)
    const newEvent = await Event.create({
      title,
      description,
      category,
      startDate,
      endDate,
      locationType,
      venueName,
      address,
      eventImage,
      organizer: organizerId,
      status: "Published",
      // CRITICAL: Convert strings to actual Numbers and Booleans
      totalCapacity: parseInt(totalCapacity, 10),
      isFree: isFree === 'true' || isFree === true, 
      ticketPrice: (isFree === 'true' || isFree === true) ? 0 : parseFloat(ticketPrice || 0)
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent
    });

  } catch (error) {
    console.error("Create Event Error:", error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages });
    }

    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};
// 2. GET ALL EVENTS (With Filters)
exports.getAllEvents = async (req, res) => {
  try {
    // Remove the { status: "Published" } filter
    const events = await Event.find({}) 
      .populate("organizer", "organizerName organizerEmail")
      .sort({ startDate: 1 });

    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
};

// 3. GET EVENTS BY ORGANIZER (For Dashboard)
exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ message: "Error fetching your events" });
  }
};

// 4. UPDATE EVENT
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Security: Ensure only the owner can update
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized to update this event" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, message: "Event updated!", event });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// 5. DELETE EVENT
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    // Security check
    if (event.organizer.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.status(200).json({ success: true, message: "Event removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};