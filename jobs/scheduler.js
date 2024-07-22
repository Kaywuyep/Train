const cron = require('node-cron');
const mongoose = require('mongoose');
const Goal = require('./models/goal'); // Update the path according to your project structure

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourdbname', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Schedule task to run every day at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);

        // Find and delete goals that were achieved more than a day ago
        const result = await Goal.deleteMany({
            achieved: true,
            updatedAt: { $lt: oneDayAgo },
        });

        console.log(`Deleted ${result.deletedCount} achieved goals older than a day`);
    } catch (error) {
        console.error('Error deleting old achieved goals:', error);
    }
});

console.log('Goal cleanup scheduler started');