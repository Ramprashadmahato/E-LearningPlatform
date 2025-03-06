const mongoose = require('mongoose');

// Define the schema for the notification model
const notificationSchema = new mongoose.Schema({
  // userId references a User model. This associates the notification with a specific user.
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },

  // message contains the content of the notification
  message: {
    type: String, 
    required: true
  },

  // read is a boolean flag indicating whether the notification has been read
  read: {
    type: Boolean,
    default: false
  },

  // feedback stores any additional response or feedback associated with the notification
  feedback: {  
    type: String, 
    default: null
  },

  // createdAt stores the timestamp when the notification was created
  createdAt: {
    type: Date, 
    default: Date.now
  },
});
module.exports = mongoose.model('Notification', notificationSchema); //Export the all functions
