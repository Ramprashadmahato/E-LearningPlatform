const Notification = require("../models/Notification"); // Import the Notification model

// Get notifications for the authenticated user
const getNotifications = async (req, res) => {
  try {
    // Fetch notifications for the user based on their userId, sorted by creation date in descending order
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });

    // Respond with the list of notifications
    res.json({ success: true, notifications });
  } catch (error) {
    // If an error occurs, respond with a server error message
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Mark a notification as read
const markAsRead = async (req, res) => {
  try {
    // Find the notification by its ID
    const notification = await Notification.findById(req.params.id);

    // If notification doesn't exist or doesn't belong to the current user, return an error
    if (!notification || notification.userId.toString() !== req.user.id) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    // Mark the notification as read and save the change to the database
    notification.read = true;
    await notification.save();

    // Emit an event to notify the frontend that the notification was marked as read
    req.io.emit("notification_read", notification);

    // Respond with a success message
    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    // If an error occurs, respond with a server error message
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getNotifications, markAsRead }; // Export the functions
