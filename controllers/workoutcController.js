const Workout = require("../models/workoutModel");

const getWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find().populate('activities');
        res.status(200).json(workouts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getWorkout = async (req, res) => {
    try {
        const { id } = req.params;
        const workout = await Workout.findById({ _id: id }).populate('activities');
        if (!workout) {
            return res.status(404).json({ message: "Workout not found!" });
        }
        res.status(200).json(workout);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createWorkout = async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.status(201).json({ message: "Workout successfully created", workout });
    } catch (error) {
        res.status(500).json({ message: error.message });
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