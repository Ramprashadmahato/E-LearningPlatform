const Submission = require("../models/Submission");
const Notification = require('../models/Notification');


const submitFile = async (req, res) => {
  console.log("Authenticated user:", req.user);
  const opportunityId = req.params.id;
  const userId = req.user.id;
  console.log("Received opportunityId:", opportunityId);
  console.log("Received userId:", userId);
  console.log("Uploaded file:", req.file);

  try {
    
    
    console.log("Attempting to create submission...");
    const submission = await Submission.create({
      opportunityId: req.params.id,
      userId,

      fileUrl: req.file.filename,
      status: "Pending",
    });
    await submission.save();
    
    res.status(201).json({ message: "submission successful", submission });
  } catch (error) {
    console.error("Error creating submission:", error);
    res
      .status(500)
      .json({ message: "Failed to submit file", error: error.message });
  }
};


const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ opportunityId: req.params.id })
      .populate("userId", "name email")
      .populate("opportunityId", "title description"); 

    res.json({ opportunityId: req.params.id, submissions });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
};

const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const submission = await Submission.findById(id)
      .populate("userId", "name email")
      .populate("opportunityId", "title description");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch submission", error: error.message });
  }
};

const editSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    // Populate userId to get user email
    const submission = await Submission.findById(id).populate("userId", "name email");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
  
    // Ensure submission.userId exists and has an email
    if (!submission.userId || !submission.userId.email) {
      return res.status(400).json({ message: "User email not found for this submission" });
    }

    submission.status = status;
    submission.feedback = feedback;
    await submission.save();

    // Send notification
    await Notification.create({
      userId: submission.userId._id, // Use _id instead of userId directly
      message: `Your submission has been ${status}.`,
      feedback: feedback,
    });

    res.json({
      message: "Submission updated successfully",
      submission,
      userEmail: submission.userId.email, // Send the email to frontend
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update submission", error: error.message });
  }
};


module.exports = { submitFile, getAllSubmissions, editSubmission,getSubmissionById};