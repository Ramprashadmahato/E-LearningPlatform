const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/Db/config");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const opportunityRoutes = require("./src/routes/opportunityRoutes");
const SubmissionRoutes = require("./src/routes/submissionRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

// Initialize express app
const app = express();

// Create an HTTP server using express
const server = http.createServer(app);

// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Allow frontend to connect from this origin
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());

// Connect to the database
connectDB();

// Pass io instance to the routes
app.use((req, res, next) => {
  req.io = io; // Add io to the request object
  next();
});

// Modular routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/submissions", SubmissionRoutes);
app.use("/api/notifications", notificationRoutes); // Notifications with socket support

// Static files
app.use("/uploads", express.static("Public/uploads"));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 300).json({ message: err.message || "Server Error" });
});

// Start the server with Socket.IO on the same port (3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
