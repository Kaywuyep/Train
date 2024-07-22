// Import express
const express = require('express');
const session = require('express-session')
const dotenv = require('dotenv');
const connectDB = require("./config/dbConfig");
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
//const connectMongodbSession = require("connect-mongodb-session");
// to include flash messages
const flashMiddleware = require("./middlewares/flashMessages");
// Import routes
const userRouter = require('./routes/userRoutes');
const activityRouter = require('./routes/activityRoute');
const workoutRouter = require('./routes/workoutRoute');
const { getUserProfile } = require('./controllers/userController');
//const remRouter = require('./routes/remGoalRoute');

const oneDay = 24 * 60 * 60 * 1000;

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

// flash messages
flashMiddleware(app);
// Use the CORS middleware
app.use(cors({
    origin: '*', // Allow requests from all origin
  }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static('public'))

// install view engine
// Set up views (assuming using EJS)
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Configure session middleware
app.use(session({
  secret: process.env.JWT_KEY, // Replace with a strong secret key
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: false }
  cookie: { secure: true, httpOnly: true, maxAge: oneDay } // Set to true for production (HTTPS)
  //store: connectMongodbSession
}));

// Use routes
app.get('/', (req, res) => {
  res.render('home');
});
//app.use('/v1/api/reminder', remRouter);
app.use('/v1/api/users', userRouter);
app.use('/v1/api/activities', activityRouter);
app.use('/v1/api/workout', workoutRouter);



module.exports= app;