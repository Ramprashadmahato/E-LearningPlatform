const mongoose = require("mongoose");

// Define the schema for the opportunity model
const opportunitySchema = mongoose.Schema({
  // title of the opportunity (e.g., Job title, Seminar topic)
  title: { 
    type: String, 
    required: true
  },

  // detailed description of the opportunity
  description: { 
    type: String,
    required: true
  },

  // type of opportunity, restricted to certain values: Job, Seminar, Internship, Training
  type: { 
    type: String, 
    enum: ["Job", "Seminar", "Internship", "Training"], 
    required: true
  },

  // user who created the opportunity, referencing the User model
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  },

  // deadline for the opportunity (e.g., application deadline)
  deadline: { 
    type: Date, 
    required: true 
  },
  eligibility: {
    type: String,
    required: true,  // This field is now required
},
  // list of participants who are associated with the opportunity, referencing User model
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User"
  }],
});
module.exports = mongoose.model("Opportunity", opportunitySchema); //Export all functions
