const Opportunity = require("../models/opportunity"); // Import the Opportunity model

// Create a new opportunity
const createOpportunity = async (req, res) => {
  try {
    const { title, description, type, deadline,eligibility } = req.body;

    // Ensure 'createdBy' is set to the current user's id from the token
    const opportunityData = {
      title,
      description,
      type,
      createdBy: req.user.id,  // Using the decoded user id from the token
      deadline,
      eligibility,
    };
    // Create the opportunity and save it to the database
    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();

    // Respond with success message and the created opportunity
    res.status(201).send({ success: true, message: "Opportunity created successfully!", opportunity });
  } catch (error) {
    console.error("Error creating opportunity:", error);
    // Respond with an error message if something goes wrong
    res.status(500).send({ message: "Failed to create the opportunity. Please try again." });
  }
};

// Get all opportunities
const getOpportunities = async (req, res) => {
  try {
    // Fetch all opportunities and populate the 'createdBy' field with user details (name, email)
    const opportunities = await Opportunity.find().populate("createdBy", "name email");
    
    // Return the list of opportunities
    res.json(opportunities);
  } catch (error) {
    // Handle error in fetching opportunities
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
};

// Get an opportunity by its ID
const getOpportunityById = async (req, res) => {
  try {
    // Find an opportunity by ID and populate the 'createdBy' field with user details
    const opportunity = await Opportunity.findById(req.params.id).populate("createdBy", "name email");
    
    // If opportunity is not found, respond with 404 error
    if (!opportunity) return res.status(404).json({ message: "Opportunity not found" });

    // Return the opportunity data
    res.json(opportunity);
  } catch (error) {
    // Handle error in fetching opportunity by ID
    res.status(500).json({ message: "Failed to fetch opportunity" });
  }
};

// Update an existing opportunity
const updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params; // Get the opportunity ID from request params
    const { title, description, type, deadline } = req.body; // Extract the fields to be updated

    // Find the opportunity by ID and update it with the new data
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      { title, description, type, deadline },
      { new: true, runValidators: true } // Ensure it returns the updated object and validates inputs
    );

    // If opportunity doesn't exist, return a 404 error
    if (!updatedOpportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Return the updated opportunity
    res.status(200).json(updatedOpportunity);
  } catch (error) {
    console.error('Error updating opportunity:', error);
    // Return an internal server error if something goes wrong
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete an opportunity
const deleteOpportunity = async (req, res) => {
  try {
    const opportunityId = req.params.id; // Opportunity ID from request params

    // Attempt to find and delete the opportunity by its ID
    const deletedOpportunity = await Opportunity.findByIdAndDelete(opportunityId);

    // If opportunity doesn't exist, return a 404 error
    if (!deletedOpportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    // Respond with success message and the deleted opportunity data
    res.status(200).json({ message: 'Opportunity deleted successfully', opportunity: deletedOpportunity });
  } catch (error) {
    console.error('Error deleting opportunity:', error.message);
    // Handle error in deleting opportunity
    res.status(500).json({ error: 'Failed to delete opportunity' });
  }
};

module.exports = {createOpportunity, getOpportunities, getOpportunityById, updateOpportunity, deleteOpportunity};  // Export the functions
