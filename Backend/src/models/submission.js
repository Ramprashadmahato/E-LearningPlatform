const mongoose = require("mongoose");

// Define the schema for the submission model
const submissionSchema = mongoose.Schema(
  {
    // opportunityId references the specific opportunity for which this submission was made
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Opportunity"
    },

    // userId references the user who made the submission
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User"
    },

    // fileUrl stores the location of the file that was submitted
    fileUrl: {
      type: String, 
      required: true
    },

    // status represents the current status of the submission ( Pending, Reviewed, Approved, Rejected)
    status: {
      type: String, 
      enum: ["Pending", "Reviewed", "Approved", "Rejected"], 
      default: "Pending"
    },

    // feedback provides any comments or feedback on the submission
    feedback: {
      type: String, 
      default: ""
    },
  },
  { timestamps: true } 
);
module.exports = mongoose.model("submission", submissionSchema); //Export all functions
