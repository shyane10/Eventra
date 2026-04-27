const jwt = require("jsonwebtoken");

// 1. Authentication Middleware: Checks if user is logged in
const verifyToken = (req, res, next) => {
    // Look for token in 'Authorization' header (Format: Bearer <token>)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Access Denied. No token provided." 
        });
    }

    try {
        // Verify the token using your Secret Key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data (id and role) to the request object
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: "Invalid or expired token." 
        });
    }
};

// 2. Authorization Middleware: Checks if the user is an Organizer
const isOrganizer = (req, res, next) => {
    // req.user is available because verifyToken runs first
    if (req.user && (req.user.role === "organizer" || req.user.role === "admin")) {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden. Only organizers can perform this action." 
        });
    }
};

// 3. Authorization Middleware: Checks if the user is an Admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        return res.status(403).json({ 
            success: false, 
            message: "Forbidden. Only admins can perform this action." 
        });
    }
};

// 4. Export as an object (CRITICAL for your Routes to work)
module.exports = { 
    verifyToken, 
    isOrganizer,
    isAdmin
};