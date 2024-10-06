import mongoose from 'mongoose';

// Define the character schema
const WillItKillOfTheDaySchema = new mongoose.Schema({
    video_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'willitkill', // Reference to the Character model
        required: false
    },
    prevvideos: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'willitkill', // Reference to the Characters model
        required: true
    }
})

export const WillItKillOfTheDayModel = mongoose.model('WillItKillOfTheDay', WillItKillOfTheDaySchema);