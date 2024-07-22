const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goalType: {
        type: String,
        required: true,
        unique: true
    },
    target: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    currentProgress: {
        type: Number,
        default: 0
    },
    targetDate: {
        type: Date,
        required: true
    },
    achieved: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
