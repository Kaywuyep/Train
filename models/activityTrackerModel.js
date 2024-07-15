/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: [true, 'An activity must have a type'],
        trim: true
    },
    durationPerWeek: {
        type: Number,
        required: [true, 'An activity must have a duration'],
    },
    repetitionsPerWeek: {
        type: Number,
        default: 0
    },
    startWeight: {
        type: Number,
        default: 0
    },
    weightLost: {
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
