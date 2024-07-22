const User = require("../models/usermodel");
const Goal = require('../models/goalModel');
const Reminder = require('../models/reminderModel')

const reminder = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.id?.toString();
        
        const { message, date } = req.body;;

        if (!userId) {
            return res.status(401).send('User not authenticated');
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const newReminder = new Reminder({
            userId,
            message,
            date,
            sent: false,
        });
      
        await newReminder.save();

        // Update the corresponding user document to include the newly created workout ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { reminder: newReminder._id } },
      { new: true }  //Return the updated user document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update session user object (if applicable)
    if (req.session && req.session.user) {
      if (!req.session.user.reminder) {
        req.session.user.reminder = [];
      }
      req.session.user.reminder.push(newReminder._id);
    }

    //console.log(newReminder);

        res.status(200).send('Reminder set successfully');
    } catch (error) {
        console.error('Error setting reminder:', error);
        res.status(500).send('Internal server error');
    }
};


const setGoal = async (req, res) => {
  try {
      const userId = req.session.user && req.session.user.id?.toString();
      const { goalType, target, unit, targetDate } = req.body;

      if (!userId) {
          return res.status(401).send('User not authenticated');
      }

      // Create new goal
      const newGoal = new Goal({
          userId,
          goalType,
          target,
          unit,
          targetDate,
          currentProgress: 0
      });

      await newGoal.save();

      // Update the corresponding user document to include the newly created goal ID
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $push: { goal: newGoal._id } },
          { new: true } // Return the updated user document
      );
      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update session user object (if applicable)
      if (req.session && req.session.user) {
          if (!req.session.user.goal) {
              req.session.user.goal = [];
          }
          req.session.user.goal.push(newGoal._id);
      }

      //console.log(newGoal);
      res.status(201).send('Goal set successfully');
  } catch (error) {
      console.error('Error creating goal:', error);
      res.status(500).send('Server error');
  }
};


  const getGoal = async (req, res) => {
    try {
      // Optional check for user authentication (modify based on your logic)
      if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Assuming the user ID is in the route parameter named 'id'
      //const userId = req.params.id;
      const userId = req.session.user && req.session.user.id?.toString();
      //console.log("session:", userId );
  
      // Retrieve user data based on ID
      const user = await User.findById(userId).populate('goal');
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Retrieve goals based on user ID (if applicable)
      let goals;
      // Assuming a field named "userId" in the Workout model for ownership
      // goals = await Goal.find({ userId });
      goals = user.goal;
      //console.log(workouts);
  
      // Pass user object, roles (if appropriate), and workouts to the template
      res.render( 'dashboard', { goals, user, roles: user.roles });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const achieved = async (req, res) => {
    try {
        const goalId = req.params.goalId; // Assuming goalId is passed as a URL parameter
        const userId = req.session.user && req.session.user.id?.toString();

        //console.log("Goal ID:", goalId);
        //console.log("User ID:", userId);

        // Ensure goalId and userId are valid before proceeding
        if (!goalId || !userId) {
            return res.status(404).json('Goal ID or User ID not provided');
        }

        // Update the goal to mark it as achieved
        const result = await Goal.updateOne(
            { _id: goalId, userId: userId },
            { $set: { achieved: true } }
        );

        // Check if the update was successful
        if (result.nModified === 0) {
            return res.status(404).json('Goal not found or already achieved');
        }

        //console.log(`Goal with ID ${goalId} marked as achieved for user ${userId}`);
        res.redirect('/v1/api/users/dashboard'); // Redirect back to the dashboard
    } catch (error) {
        console.log({ message: "Error marking goal as achieved", error });
        res.redirect('/v1/api/users/dashboard'); // Handle error appropriately
    }
};


const notifications = async (req, res) => {
  try {
      const userId = req.session.user && req.session.user.id?.toString();
      
      if (!userId) {
          return res.status(401).send('User not authenticated');
      }

      // Fetch the user with populated reminders and goals
      const user = await User.findById(userId).populate('reminders').populate('goals');
      if (!user) {
        return res.status(404).send('User not found');
      }

      //const notifications = { 
        //reminders: user.reminder,
        //goals: user.goal,
      //};
      res.status(200).json({
        reminders: user.reminders,
        goals: user.goals,
      });

      //console.log(notifications);
      //res.status(200).json(notifications);
  } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};


const updateNotificationId = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.session.user && req.session.user.id?.toString();

    // Find the reminder and update its status to 'sent'
    const reminder = await Reminder.findOneAndUpdate(
      { _id: notificationId, userId: userId },
      { $set: { sent: true } },
      { new: true }
    );

    if (!reminder) {
      return res.status(404).send('Reminder not found');
    }

    res.status(200).send('Reminder updated');
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
    reminder,
    setGoal,
    getGoal,
    achieved,
    notifications,
    updateNotificationId,
  };