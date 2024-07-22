const Activity = require("../models/activityTrackerModel");
const User = require("../models/usermodel");

const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getActivity = async (req, res) => {
    try {
        // Optional check for user authentication (modify based on your logic)
        if (!req.session.user) {
          return res.status(401).json({ message: 'Unauthorized' });
        }
    
        // Assuming the user ID is in the route parameter named 'id'
        const userId = req.session.user && req.session.user.id?.toString();
        //console.log("session:", userId );
    
        // Retrieve user data based on ID
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found!" });
        }
    
        // Retrieve workouts based on user ID (if applicable)
        let activities;
        // Assuming a field named "userId" in the Activity model for ownership
        activities = await Activity.find({ userId });
        //console.log(activities);
    
        // Pass user object, roles (if appropriate), and activities to the template
        res.render('activityTrack', { activities, user, roles: user.roles });
      } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Internal Server Error' });
      }
    };

const createActivity = async (req, res) => {
    try {
        // Retrieve workout data from the request (e.g., req.body)
        const activityData = { ...req.body };
    
        // Retrieve user ID from session (if applicable)
        const userId = req.session.user && req.session.user.id?.toString();
        //console.log("session.id:", userId)
        // Ensure userId is a valid string before setting it
        if (userId && typeof userId === 'string') {
          activityData.userId = userId;
        } else {
          return res.status(400).json({ message: "Invalid user ID in session" });
        }
    
        const activity = new Activity(
          activityData
          //userId
        );
        await activity.save();
        // Update the corresponding user document to include the newly created workout ID
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { activityTrack: activity._id } },
        { new: true }  //Return the updated user document
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      // Update session user object (if applicable)
      if (req.session && req.session.user) {
        if (!req.session.user.activityTrack) {
          req.session.user.activityTrack = [];
        }
        req.session.user.activityTrack.push(activity._id);
      }
  
      //console.log(activity);
  
  
        res.redirect("/v1/api/users/dashboard")
        //res.status(201).json({ message: "Workout successfully created!", workout, user: updatedUser });
      } catch (error) {
        console.log({ message: error.message});
        res.redirect('/v1/api/activities/:id')
        //res.status(500).json({ message: error.message });
      }
    };

const updateActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!activity) {
            return res.status(404).json({ message: "Activity not found!" });
        }
        res.status(200).json({ message: "Activity successfully updated", activity });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteActivity = async (req, res) => {
    try {
        const { id } = req.params;
        const activity = await Activity.findByIdAndDelete({ _id: id });
        if (!activity) {
            return res.status(404).json({ message: "Activity not found!" });
        }
        res.status(200).json({ message: "Activity successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActivities,
    getActivity,
    createActivity,
    updateActivity,
    deleteActivity
};