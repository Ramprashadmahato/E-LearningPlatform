const express = require("express");
// Create a new router instance for handling submission routes
const router = express.Router();

// Import middleware for file upload (using multer) and authentication/authorization
const upload = require("../middleware/multer");
const { verifyToken, verifyRole } = require("../middleware/middleware");

// Import the controller functions for handling submissions
const {submitFile, getAllSubmissions, editSubmission, getSubmissionById } = require("../controller/submissionController");

// Route to submit a file (for an opportunity)
router.post("/submit", verifyToken, upload.single("image"), submitFile);

// Route to get all submissions (only Recruiter roles allowed)
router.get("/", verifyToken, verifyRole(["Recruiter","Participant"]), getAllSubmissions);

// Route to get a specific submission by its ID
router.get("/:id", verifyToken, getSubmissionById);

// Route to update a submission (only Recruiter role allowed)
router.put("/:id", verifyToken, verifyRole(["Recruiter"]), upload.single("image"), editSubmission);

// Export the router to be used in the main app
module.exports = router;
