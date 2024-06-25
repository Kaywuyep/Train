const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.DB_URI;

const connectToDB = async () => {
    if (!mongoUri) {
        console.error("MongoDB URI is not defined. Please set the DB_URI environment variable.");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Connection to MongoDB successful");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToDB;