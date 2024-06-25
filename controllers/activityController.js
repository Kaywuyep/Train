const Activity = require("../models/activityTrackerModel");

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
        const { id } = req.params;
        const activity = await Activity.findById({ _id: id });
        if (!activity) {
            return res.status(404).json({ message: "Activity not found!" });
        }
        res.status(200).json(activity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createActivity = async (req, res) => {
    try {
        const activity = new Activity(req.body);
        await activity.save();
        res.status(201).json({ message: "Activity successfully created", activity });
    } catch (error) {
        res.status(500).json({ message: error.message });
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