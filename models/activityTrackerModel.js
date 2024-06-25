/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, 'An activity must have a type'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'An activity must have a duration'],
    },
    distance: {
        type: Number,
        default: 0
    },
    repetitions: {
        type: Number,
        default: 0
    },
    sets: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [200, 'Notes must be less than or equal to 200 characters']
    }
}, { timestamps: true });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
