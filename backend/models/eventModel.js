const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    // 1. Basic Information
    title: {
        type: String,
        required: [true, "Event title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Event description is required"]
    },
    category: {
        type: String,
        required: true,
        enum: ["Music", "Tech", "Sports", "Workshop", "Conference", "Other"],
        default: "Other"
    },

    // 2. Date & Time
    startDate: {
        type: Date,
        required: [true, "Start date and time are required"]
    },
    endDate: {
        type: Date,
        required: [true, "End date and time are required"]
    },

    // 3. Location Details
    locationType: {
        type: String,
        enum: ["Venue", "Online"],
        required: true
    },
    venueName: String, // e.g., "Pragya Bhawan"
    address: String,   // Physical address
    city: String,
    mapLink: String,   // Google Maps URL
    meetingLink: String, // Zoom/Google Meet link for Online events

    // 4. Ticketing & Capacity
    isFree: {
        type: Boolean,
        default: false
    },
    ticketPrice: {
        type: Number,
        default: 0,
        min: [0, "Price cannot be negative"]
    },
    totalCapacity: {
        type: Number,
        required: true,
        min: [1, "Capacity must be at least 1"]
    },
    availableTickets: {
        type: Number
    },

    // 5. Media
    eventImage: {
        type: String, // URL to Cloudinary or local path
        default: "default-event.jpg"
    },

    // 6. Ownership & Tracking
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organizer", // Links the event to the person who created it
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Cancelled", "Completed"],
        default: "Pending"
    },
    tags: [String], // e.g., ["React", "Networking", "2026"]

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Middleware to set availableTickets equal to totalCapacity on first save
// Remove 'next' from the parameters
eventSchema.pre("save", async function() {
    if (this.isNew) {
        this.availableTickets = this.totalCapacity;
    }
    // No need to call next() here if the function is async
});

module.exports = mongoose.model("Event", eventSchema);