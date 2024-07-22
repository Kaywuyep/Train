const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true },
    date: {
        type: Date,
        required: true },
    sent: {
        type: Boolean,
        default: false },
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
