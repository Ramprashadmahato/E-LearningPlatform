const express = require("express");
// Import the controller functions for handling user authentication
const { registerUser, loginUser, logout } = require("../controller/authController");

// Create a new router instance for handling authentication routes
const router = express.Router();

// Route to handle user registration
router.post("/register", registerUser);

// Route to handle user login
router.post("/login", loginUser);

// Route to handle user logout
router.post("/logout", logout); 

// Export the router to be used in the main app
module.exports = router;
