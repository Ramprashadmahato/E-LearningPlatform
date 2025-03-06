const express = require('express');
// Create a new router instance for handling notification routes
const router = express.Router();

// Import controller functions for notifications
const { getNotifications, markAsRead } = require('../controller/notificationController');
// Import middleware for verifying the token (authentication)
const { verifyToken } = require('../middleware/middleware');

// Route to get all notifications for the authenticated user
router.get('/', verifyToken, getNotifications);

// Route to mark a specific notification as read
router.put('/:id', verifyToken, markAsRead);

// Export the router to be used in the main app
module.exports = router;
