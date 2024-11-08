import { UserModel } from '../models/user.model.js';
import { AchievementModel } from '../models/achievement.model.js';
import { UserAchievementModel } from '../models/userachievement.model.js';

export const getAchievements = async (req, res) => {
    try {
        const achievements = await AchievementModel.find();
        res.status(200).json(achievements);
    }
    catch (err) {
        res.status(500).json({ message: 'An error occurred while fetching achievements.' });
    }
}

export const getUserAchievements = async (req, res) => {
    try {
        const userId = req.userId;  // Extracted from JWT
        if (!userId) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Fetch all achievements
        const achievements = await AchievementModel.find();

        // Fetch user's progress for each achievement
        const userAchievements = await UserAchievementModel.find({ userId });

        const achievementProgress = achievements.map((achievement) => {
            const userAchievement = userAchievements.find(
                (ua) => ua.achievementId.toString() === achievement._id.toString()
            );
            return {
                name: achievement.name,
                description: achievement.description,
                condition: achievement.condition,
                progress: userAchievement ? userAchievement.progress : 0,
                completed: userAchievement ? userAchievement.completed : false,
                points: achievement.points,
            };
        });

        res.status(200).json(achievementProgress);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching achievements' });
    }
};

export const modifyUserAchievement = async (req, res) => {
    try {
        const userId = req.userId; // Extracted from JWT
        const { achievementName } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Find the achievement by name
        const achievement = await AchievementModel.findOne({ name: achievementName });
        if (!achievement) {
            return res.status(404).json({ message: 'Achievement not found' });
        }

        // Find the user's achievement progress
        let userAchievement = await UserAchievementModel.findOne({
            userId,
            achievementId: achievement._id,
        });

        // If the userAchievement doesn't exist, create it
        if (!userAchievement) {
            userAchievement = new UserAchievementModel({
                userId,
                achievementId: achievement._id,
                progress: 0,
                completed: false,
            });
        }

        // Check if the achievement is already completed
        if (userAchievement.completed) {
            return res.status(200).json({
                message: 'Achievement already completed',
                userAchievement,
            });
        }

        // Update the progress
        userAchievement.progress += 1;

        // Check if the achievement is now completed
        let completedNow = false;
        if (userAchievement.progress >= achievement.condition) {
            userAchievement.progress = achievement.condition; // Ensure progress doesn't exceed condition
            userAchievement.completed = true;
            completedNow = true;
        }

        await userAchievement.save();
        res.status(200).json({
            message: 'Achievement progress updated',
            completed: completedNow,
            userAchievement,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while modifying the achievement' });
    }
};

export const unlockAchievement = async (req, res) => {
    try {
        const { userId, achievementName } = req.body;

        const achievement = await AchievementModel.findOne({ name: achievementName });
        const userAchievement = await UserAchievementModel.findOne({ userId, achievementId: achievement._id });

        if (!userAchievement || !achievement) {
            return res.status(400).json({ message: 'User or achievement not found' });
        }

        if (userAchievement.progress >= achievement.condition && !userAchievement.completed) {
            userAchievement.completed = true;
            await userAchievement.save();

            res.status(200).json({ message: 'Achievement unlocked', userAchievement });
        } else {
            res.status(200).json({ message: 'Achievement not yet unlocked' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'An error occurred while unlocking the achievement' });
    }
};

export const getLeaderboard = async (req, res) => {
    try {
        // Get the total number of achievements
        const totalAchievements = await AchievementModel.countDocuments();

        // Aggregate data to get the leaderboard
        const leaderboard = await UserAchievementModel.aggregate([
            // Match only completed achievements
            { $match: { completed: true } },
            // Lookup achievements to get points
            {
                $lookup: {
                    from: 'achievements', // Collection name in MongoDB
                    localField: 'achievementId',
                    foreignField: '_id',
                    as: 'achievement',
                },
            },
            // Unwind the achievement array
            { $unwind: '$achievement' },
            // Group by userId and sum the points
            {
                $group: {
                    _id: '$userId',
                    totalPoints: { $sum: '$achievement.points' },
                    achievementCount: { $sum: 1 },
                },
            },
            // Sort by totalPoints descending
            { $sort: { totalPoints: -1 } },
            // Limit to top 50 users
            { $limit: 50 },
            // Lookup users to get username
            {
                $lookup: {
                    from: 'users', // Collection name in MongoDB
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            // Unwind the user array
            { $unwind: '$user' },
            // Project the fields we need
            {
                $project: {
                    _id: 0,
                    userId: '$_id',
                    username: '$user.username',
                    totalPoints: 1,
                    achievementCount: 1,
                },
            },
        ]);

        res.json({ totalAchievements, leaderboard });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
