import corn from 'node-cron';
import Poll from '../models/Poll.js';
import Vote from '../models/Vote.js';

// Run every hour to clean up expired polls
cron.schedule('0 * * * *', async () => {
    try {
        const now = new Date();

        // Find expired polls
        const expiredPolls = await Poll.find({
            expiresAt: { $lt: now },
            isActive: true
        });

        if (expiredPolls.length > 0) {
            const pollIds = expiredPolls.map(poll => poll._id);

            // Delete associated votes
            await Vote.deleteMany({ pollId: { $in: pollIds } });

            // Delete polls
            await Poll.deleteMany({ _id: { $in: pollIds } });

            console.log(`Cleaned up ${expiredPolls.length} expired polls at ${now}`);
        }
    } catch (error) {
        console.error('Error in cleanup scheduler:', error);
    }
});

export default cron;