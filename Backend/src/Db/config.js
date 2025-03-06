const mongoose = require("mongoose");

// Function to connect to MongoDB
const connectDb = async () => {
    try {
        // Connect to the MongoDB Atlas database using mongoose
        await mongoose.connect(
            "mongodb+srv://rpxingh201:Ram%401590@cluster0.vzvzy.mongodb.net/Ram?retryWrites=true&w=majority"
        );
        console.log("Database connected successfully"); // Log success message if the connection is established
    } catch (error) {
        // If an error occurs during connection, log the error message
        console.error("Error connecting to the database:", error.message);
        process.exit(1); // Exit the process with a failure status code (1) if the connection fails
    }
};

// Export the connectDb function so it can be used in other parts of the application
module.exports = connectDb;
