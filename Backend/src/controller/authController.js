const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import the User model to interact with the database

// Generate JWT
const generateToken = (user) => {
  // Generate a JSON Web Token (JWT) for the user
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body; // Get data from the request body

  try {
    // Check if user with the provided email already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      // If user exists, return a bad request error with a message
      return res.status(400).json({ message: "User already exists" });
    }

    // If user doesn't exist, create a new user
    const user = await User.create({ name, email, password, role });

    if (user) {
      // If user is created successfully, return user data along with a token
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user), // Generate and return JWT
      });
    } else {
      // If there was an issue creating the user, send a bad request error
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    // If an error occurs during registration, send a server error response
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body; // Get login credentials from the request body

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If the user exists and the password matches, log the user in
    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile, // Include profile information if available
        token: generateToken(user), // Generate and return JWT
      });
    } else {
      // If the credentials are invalid, send a 401 unauthorized error
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    // If an error occurs during login, send a server error response
    res.status(500).json({ message: "Server error" });
  }
};

// Logout user
const logout = (req, res) => {
  // Logout simply responds with a success message as there is no token to invalidate on the server
  res.status(200).json({ message: "Logged out successfully." });
};
module.exports = { registerUser, loginUser, logout }; //export the functions
