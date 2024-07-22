const cron = require('node-cron');
const User = require('../models/usermodel');

// Schedule tasks to be run on the server
cron.schedule('0 * * * *', async () => { // This runs every minute

    const users = req.session.user && req.session.user.id?.toString();
    users = await User.find({});
    
    users.forEach(user => {
        user.reminders.forEach(async reminder => {
            if (new Date() >= new Date(reminder.date) && !reminder.sent) {
                // Logic to notify user show notification in UI
                console.log(`Reminder: ${reminder.message}`);
                reminder.sent = true;
                sessionUpdated = true;
                await user.save();
            }
        });

    user.goals.forEach(goal => {
        if (goal.goal.currentProgress >= goal.goal.target) {
            // Logic to notify user show notification in UI
            console.log(`Congratulations! You have achieved your goal: ${goal.goal.goalType}`);
        }
    });
});
});
