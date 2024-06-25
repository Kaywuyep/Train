/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    name: {
        type: String,
        trim: true,
        maxlength: [40, 'A workout name must be less than or equal to 40 characters'],
        minlength: [5, 'A workout name must be greater than or equal to 5 characters']
    },
    duration: {
        type: Number,
        required: [true, 'A workout must have a duration']
    },
    repetitions: {
        type: Number,
        required: [true, 'A workout must have a repetitions number']
    },
    difficulty: {
        type: String,
        required: [true, 'A workout must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either easy, medium or difficult'
        }
    },
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }],
    caloriesBurned: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;