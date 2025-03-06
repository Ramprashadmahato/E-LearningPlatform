const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the User model
const userSchema = mongoose.Schema(
  {
    // name of the user (required)
    name: { 
      type: String, 
      required: true 
    },

    // email of the user (required, must be unique)
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },

    // password for the user (required)
    password: { 
      type: String, 
      required: true 
    },

    // role of the user, limited to "Admin", "Recruiter", or "Participant"
    role: { 
      type: String, 
      enum: ["Admin", "Recruiter", "Participant"], 
      default: "Participant" // Default role is "Participant"
    },

    // profile object containing bio, resume, and participation history
    profile: {
      // bio field for user description
      bio: { type: String },

      // resume field for storing the resume URL or file path
      resume: { type: String },

      // participation history references the Opportunity model
      participationHistory: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Opportunity" // References the Opportunity collection
      }],
      quizScores: [{ date: { type: Date, default: Date.now }, score: Number }], 
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Password hashing middleware: Hashes password before saving user
userSchema.pre("save", async function (next) {
  // Only hash password if it has been modified or is new
  if (!this.isModified("password")) return next();

  // Generate salt for hashing the password
  const salt = await bcrypt.genSalt(10);
  
  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);

  // Proceed to save the user
  next();
});

// Password comparison method: Compares entered password with stored hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the entered password with the hashed password in the database
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update user information (ensures password is hashed if updated)
userSchema.methods.updateUser = async function (updates) {
  // Update all fields except password
  Object.keys(updates).forEach(key => {
    if (key !== 'password') {
      this[key] = updates[key];
    }
  });

  // If the password is updated, hash the new password
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(updates.password, salt);
  }

  // Save the updated user data
  await this.save();
};

// Export the User model to be used elsewhere in the application
module.exports = mongoose.model("User", userSchema);
