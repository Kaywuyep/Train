const User = require("../models/usermodel");
const Workout = require("../models/workoutModel");
const Activity = require("../models/activityTrackerModel");
const Goal = require("../models/goalModel");
const Reminder = require("../models/reminderModel")
const bcrypt = require("bcrypt");
//const bcrypt = require("bcrypt");
//const generateToken = require("../utils/generatetoken");


const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (!users) {
            return res.status(400).json({ message: `${User} not found!!`})
        }
        res.status(200).json(users)

    } catch(error){
        res.status(500).json({message: error.message})
    }
};
const getUserProfile = async (req, res) => {
    try {
      // Retrieve user ID from the session
      const userId = req.session.user && req.session.user.id?.toString();
  
      // Ensure userId is valid before proceeding
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ message: "Invalid user ID in session" });
      }
  
      // Fetch the user document and populate the 'workoutTrack' field
      const user = await User.findById(userId).populate('workoutTrack').populate('activityTrack');
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching user profile" });
    }
  };

  const dashboard = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.id?.toString();
        //const workoutIds = req.session.user.workouts;
        //const workouts = await Workout.find({ _id: { $in: workoutIds } });
        const user = await User
        .findById(userId)
        .populate('workoutTrack')
        .populate('activityTrack')
        .populate('goal')
        .populate('reminder');
        //const activityIds = req.session.user.activities;
        //const activities = await Activity.find({ _id: { $in: activityIds } });
        
        //const goalIds = req.session.user.goal;
        //const goals = await Goal.find({ _id: { $in: goalIds } });
        
        //const reminderIds = req.session.user.reminder;
        //const reminders = await Reminder.find({ _id: { $in: reminderIds } });

        // console.log(reminders); // Log the goals data
        res.render('dashboard', {
            reminders: user.reminder,
            goals: user.goal,
            //workouts: workouts,
            workouts: user.workoutTrack, 
            activities: user.activityTrack,
            user: req.session.user.name,
            roles: req.session.user.roles, 
        });
    } catch (error) {
        console.log({message: "Error fetching user data"});
        res.redirect('/v1/api/users/login');
    }
};

const profile = async (req, res) => {
    try {
        const workoutIds = req.session.user.workouts;
        const workouts = await Workout.find({ _id: { $in: workoutIds } });
        const activityIds = req.session.user.activities;
        const activities = await Activity.find({ _id: { $in: activityIds } });

        res.render('profile', {
            workouts: workouts, 
            activities: activities,
            user: req.session.user.name,
            roles: req.session.user.roles,
            email: req.session.user.email,
            phone: req.session.user.phone, 
        });
    } catch (error) {
        console.log({message: "Error fetching profile"});
        res.redirect('/v1/api/users/dashboard');
    }
};


const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        // Check if the necessary fields are present
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists!" });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        req.body.password = hashedPassword;
        const userdata = await User.insertMany(req.body);
        //console.log(userdata);

        // Create new user object
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
        });

        // Save new user
        //await newUser.save();
        if (newUser) {
            res.redirect("/v1/api/users/login");
        } else {
            res.redirect("/v1/api/users/signup")
        }

        //res.status(201).json({ message: "User successfully added", user: newUser });
    } catch (error) {
        console.log("error registering new user:", error.message)
        res.status(500).json({ message: error.message });
    }
};
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if username exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'email cannot be found' });
        }

        // Log retrieved user information for debugging
        //console.log("Retrieved User:", user);

        // Ensure password is provided
        if (!password) {
            console.log("Password not provided");
            return res.status(400).json({ message: 'Password not provided' });
        }

        // Compare the hashed password from the db
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        
        // Log password comparison results for debugging
        //console.log("Password Match Result:", isPasswordMatch);

        if (isPasswordMatch) {
            //const token = generateToken(user._id);
            //console.log({session_token: token })
            //req.session.user = { name: user.username, roles: user.roles, token };
            req.session.user = {
            id: user._id,
            name: user.username,
            roles: user.roles,
            email: user.email,
            phone: user.phone,
            workouts: user.workoutTrack,
            activities: user.activityTrack,
            goals: user.goal,
            reminders: user.reminder,
            };
            
            console.log("Session User Object:", req.session.user);
            res.redirect("/v1/api/users/dashboard");
        } else {
            res.redirect("/v1/api/users/login")
            console.log("Password mismatch");
            //return res.status(400).json({ message: 'Password mismatch' });
        }
    } catch (error) {
        console.error('An error occurred during login:', error.message);
        res.status(500).json({ message: error.message });
    }
};

const updateById = async (req, res) => {
    try {
        const id = req.params.id;
        const userExist = await User.findOne({ _id: id });
        if (!userExist) {
            return res.status(400).json({ message: "User does not exists!!" });
        }
        const updateUser = await User.findByIdAndUpdate(id, req.body, {new: true});

        res.status(200).json({ message: `${updateUser}User profile updated successfully!!`})
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUsers = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Unauthorized' });
          }
      
          // Assuming the user ID is in the route parameter named 'id'
          const userId = req.session.user && req.session.user.id?.toString();
          //console.log("session:", userId );
      
          // Retrieve user data based on ID
          const userExist = await User.findById(userId);
          if (!userExist) {
            return res.status(404).json({ message: "User not found!" });
          }
        const deleteUser = await User.findByIdAndDelete(userId);

        if (!deleteUser) {
            return res.status(404).json({ error: "User not found!"})
        }
        // Delete related documents
        await Workout.deleteMany({ userId });
        await Activity.deleteMany({ userId });
        await RemGoal.deleteMany({ userId });
        res.redirect("/v1/api/users/signup")

        //res.status(200).json({ message: "User successfully deleted!"});
    } catch(error) {
        res.status(500).json({error: error.message})
    }
};

const logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err); // Handle session destruction error
        return res.status(500).json({ message: "Error logging out" });
      }

      res.redirect("/v1/api/users/login");
      //res.status(200).json({ message: "Logged out successfully" });
    });
};

module.exports = {
    dashboard,
    profile,
    getUsers,
    getUserProfile,
    registerUser,
    loginUser,
    updateById,
    deleteUsers,
    logout
};