import mongoose from 'mongoose';

// Define the character schema
const AchievementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    condition: {
        type: Number, // integer related to the achievement
        required: true
    },
    points: {
        type: Number,
        required: true
    }
})

export const AchievementModel = mongoose.model('achievement', AchievementSchema)