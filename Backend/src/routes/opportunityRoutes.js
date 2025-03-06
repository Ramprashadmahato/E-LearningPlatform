const express = require("express");
// Create a new router instance for handling opportunity routes
const router = express.Router();

// Import necessary middleware functions for authentication and role-based authorization
const { verifyToken, verifyRole } = require("../middleware/middleware");

// Import the controller functions for handling opportunities
const {getOpportunityById, getOpportunities, createOpportunity, updateOpportunity, deleteOpportunity} = require("../controller/opportunityController");

// Route to get all opportunities
router.get("/", getOpportunities);

// Route to get a specific opportunity by its ID
router.get("/:id", getOpportunityById);

// Route to create a new opportunity (Admin and Recruiter roles allowed)
router.post("/", verifyToken, verifyRole(["Admin", "Recruiter"]), createOpportunity);

// Route to update an existing opportunity (only Recruiter role allowed)
router.put("/:id", verifyToken, verifyRole(["Recruiter"]), updateOpportunity);

// Route to delete an opportunity (only Recruiter role allowed)
router.delete("/:id", verifyToken, verifyRole(["Recruiter"]), deleteOpportunity);

// Export the router to be used in the main app
module.exports = router;
