const Event = require("../../models/eventModel");

// 1. CREATE EVENT
exports.createEvent = async (req, res) => {
  try {
    // 1. Get the organizer ID from the auth middleware (verifyToken)
    const organizerId = req.user.id; 

    // 2. Destructure fields for specific validation if needed
    const { 
      title, startDate, endDate, totalCapacity, isFree, ticketPrice 
    } = req.body;

    // 3. Basic Validation (matches your 'required' schema fields)
    if (!title || !startDate || !endDate || !totalCapacity) {
      return res.status(400).json({ 
        success: false,
        message: "Required fields (Title, Dates, Capacity) are missing." 
      });
    }

    // 4. Handle Cloudinary Image
    // req.file.path is provided by the 'multer-storage-cloudinary' middleware
    let eventImage = "default-event.jpg"; // Your schema's default
    if (req.file) {
      eventImage = req.file.path; 
    }

    // 5. Create the Event object
    // We spread req.body and manually override specific fields to ensure type safety
    const newEvent = await Event.create({
      ...req.body,
      organizer: organizerId,
      eventImage: eventImage,
      // Convert strings from FormData back to Numbers/Booleans
      totalCapacity: Number(totalCapacity),
      ticketPrice: isFree === 'true' ? 0 : Number(ticketPrice || 0),
      isFree: isFree === 'true', // FormData sends 'true' as a string
      status: "Published" // Ensures visibility based on our previous fix
    });

    // 6. Success Response
    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent
    });

  } catch (error) {
    console.error("Create Event Error:", error);

    // Handle Mongoose Validation Errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages });
    }

    res.status(500).json({ 
      success: false, 
      message: "Failed to create event", 
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