const express = require("express");
// Import the User model to interact with the database
const User = require("../models/User");
const router = express.Router();

// GET: Get all users (ensure only admin can access this)
router.get("/", async (req, res) => {
  try {
    // Retrieve all users
    const users = await User.find();
    // Respond with the list of users
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    // If an error occurs, send a 500 server error response
    res.status(500).json({ message: "Server error." });
  }
});

// GET: Get a user by ID
router.get("/:id", async (req, res) => {
  try {
    // Retrieve the user by ID from the URL parameter
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    // Respond with the user details
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    // If an error occurs, send a 500 server error response
    res.status(500).json({ message: "Server error." });
  }
});

// PUT: Update a user (e.g., name, email, password, role, profile)
router.put("/:id", async (req, res) => {
  const { name, email, password, role, profile } = req.body;

  try {
    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Prepare the data to be updated
    const updates = {
      name,
      email,
      role,
      profile,
      password, // If password is provided, it will be hashed automatically
    };

    // Use the custom updateUser method to handle updating the user
    await user.updateUser(updates); // This ensures password is hashed if needed

    // Respond with a success message
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    // If an error occurs, send a 500 server error response
    res.status(500).json({ message: "Server error", error });
  }
});

// PATCH: Update the status of a user (activate/deactivate)
router.patch("/:id/status", async (req, res) => {
  try {
    const { action } = req.body; // action should be "activate" or "deactivate"
    
    // Ensure the action is valid (either activate or deactivate)
    if (!["activate", "deactivate"].includes(action)) {
      return res.status(400).json({ message: "Invalid action. Must be 'activate' or 'deactivate'." });
    }

    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's status based on the action
    user.status = action === "activate" ? "active" : "inactive";
    await user.save(); // Save the updated status

    // Respond with the updated user data
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    // If an error occurs, send a 500 server error response
    res.status(500).json({ message: "Error updating user status." });
  }
});

// DELETE: Remove a user
router.delete("/:id", async (req, res) => {
  try {
    // Find user by ID
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user by ID
    await User.findByIdAndDelete(req.params.id);
    // Respond with a success message
    res.status(200).json({ message: "User has been removed" });
  } catch (error) {
    console.error(error);
    // If an error occurs, send a 500 server error response
    res.status(500).json({ message: "Failed to remove user" });
  }
});
// Update user quiz score
router.post("/:id/update-score", async (req, res) => {
  try {
    const { score } = req.body;
    const userId = req.params.id; // Get user ID from URL

    if (!score) {
      return res.status(400).json({ message: "Score is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the new score to the array
    user.profile.quizScores.push({ score });

    await user.save();
    res.status(200).json({ message: "Score updated successfully", quizScores: user.profile.quizScores });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Export the router to be used in the main app
module.exports = router;
