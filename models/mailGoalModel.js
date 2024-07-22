const mongoose = require('mongoose');

const reminderGoalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //reminder: reminderSchema,
    //goal: goalSchema
    reminder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reminder',
    },
    goal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
    }
});

const remGoal = mongoose.model('remGoal', reminderGoalSchema);

module.exports = remGoal;