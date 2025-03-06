const jwt = require("jsonwebtoken");
const path = require("path");

// Authentication Middleware: Verifies if the token is valid
const verifyToken = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  // If token is not provided, deny access
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    // Verify token using the secret stored in environment variable
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to the request object for future use
    req.user = decoded;
   
    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    // Log error and send an error response if token is invalid
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Token is not valid." });
  }
};

// Role-based Authorization Middleware: Checks if the user has the required role
const verifyRole = (roles) => {
  return (req, res, next) => {
    // If the user is not authenticated, deny access
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated." });
    }

    // Log the user object from the decoded token
    console.log("User object from token:", req.user);

    // Extract the role from the user object
    const { role } = req.user;
    
    // If the role is missing from the user object, return an error
    if (!role) {
      return res.status(400).json({ message: "Role is missing in token." });
    }

    // Check if the user's role matches one of the allowed roles
    if (!roles.includes(role)) {
      // Log denied access for debugging purposes
      console.log(`Access denied. User role: ${role}, Allowed roles: ${roles}`);  
      return res.status(403).json({ message: "Access denied, insufficient permissions." });
    }

    // Proceed if the user has the required role
    next();
  };
};

// General Error Handling Middleware: Catches any errors that occur in the app
const errorHandler = (err, req, res, next) => {
  // Log the stack trace of the error for debugging purposes
  console.error(err.stack);
  // Send a generic error message to the client
  res.status(500).json({ message: "Something went wrong. Please try again later." });
};

// Export the middleware functions to be used in other parts of the application
module.exports = {
  verifyToken,
  verifyRole,
  errorHandler,
};
