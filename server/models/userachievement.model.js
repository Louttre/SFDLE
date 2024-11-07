import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'achievement'
    },
    progress: {
        type: Number,
        required: true,
        default: 0
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
});

userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const UserAchievementModel = mongoose.model('userachievement', userAchievementSchema)