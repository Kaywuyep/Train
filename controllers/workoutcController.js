const Workout = require("../models/workoutModel");
const User = require("../models/usermodel");

const getWorkouts = async (req, res) => {
    try {
      // Optional check for user authentication (modify based on your logic)
      if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      //const userId = req.session.user && req.session.user.id?.toString();
      const user = req.session.user; // Access the entire user object
  
      let workouts;
  
      // Retrieve workouts based on user ID (if applicable)
      if (user) {
        // Assuming Workout model and filtering by user ID
        workouts = await Workout.find({}); // Adjust filter if needed
      } //else {
        // Retrieve all workouts (if no user ID)
        //workouts = await Workout.find({ user: userId });
      //}
  
      // Pass user object and roles (if appropriate) to the template
      res.render('workoutplan', { workouts, user, roles: user.roles });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  const getWorkout = async (req, res) => {
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
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Retrieve workouts based on user ID (if applicable)
      let workouts;
      // Assuming a field named "userId" in the Workout model for ownership
      workouts = await Workout.find({ userId });
      //console.log(workouts);
  
      // Pass user object, roles (if appropriate), and workouts to the template
      res.render('workoutplan', { workouts, user, roles: user.roles });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

const createWorkout = async (req, res) => {
    try {
      // Retrieve workout data from the request (e.g., req.body)
      const workoutData = { ...req.body };
  
      // Retrieve user ID from session (if applicable)
      const userId = req.session.user && req.session.user.id?.toString();
      //console.log("session.id:", userId)
      // Ensure userId is a valid string before setting it
      if (userId && typeof userId === 'string') {
        workoutData.userId = userId;
      } else {
        return res.status(400).json({ message: "Invalid user ID in session" });
      }
  
      const workout = new Workout(
        workoutData
        //userId
      );
      await workout.save();
      // Update the corresponding user document to include the newly created workout ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { workoutTrack: workout._id } },
      { new: true }  //Return the updated user document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update session user object (if applicable)
    //if (req.session && req.session.user) {
      //if (!req.session.user.workoutTrack) {
        //req.session.user.workoutTrack = [];
      //}
      //req.session.user.workoutTrack.push(workout._id);
    //}
    if (req.session && req.session.user) {
      req.session.user.workoutTrack = updatedUser.workoutTrack;
    }

    //console.log(workout);


      res.redirect("/v1/api/users/dashboard")
      //res.status(201).json({ message: "Workout successfully created!", workout, user: updatedUser });
    } catch (error) {
      console.log({ message: error.message});
      res.redirect('/v1/api/workout/:id')
      //res.status(500).json({ message: error.message });
    }
  };

const updateWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findByIdAndUpdate({ _id: id }, req.body, { new: true });
        if (!workout) {
            return res.status(404).json({ message: "Workout not found!" });
        }
        res.status(200).json({ message: "Workout successfully updated", workout });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findByIdAndDelete({ _id: id });
        if (!workout) {
            return res.status(404).json({ message: "Workout not found!" });
        }
        res.status(200).json({ message: "Workout successfully deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout
};