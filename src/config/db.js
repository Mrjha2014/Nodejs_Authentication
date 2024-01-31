// Importing the mongoose library
const mongoose = require('mongoose');

// Function to connect to the database
const connectDB = async () => {
    try {
        // Connecting to the database using the provided DB_URI
        const conn = await mongoose.connect(process.env.DB_URI);

        // Logging a success message if the connection is successful
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        // Logging an error message and exiting the process if there is an error
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

// Exporting the connectDB function
module.exports = connectDB;
