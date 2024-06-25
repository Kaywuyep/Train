// Import express
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./config/dbConfig");
const bodyParser = require('body-parser');
// Import routes
const userRouter = require('./routes/userRoutes');
const activityRouter = require('./routes/activityRoute');
const workoutRouter = require('./routes/workoutRoute');

// Initialize express instance
const app = express();   
// Load environment variables from .env file
dotenv.config();
// Connect to the database
connectDB();
// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/v1/api/users', userRouter);
app.use('/v1/api/activities', activityRouter);
app.use('/v1/api/workout', workoutRouter);


module.exports= app;