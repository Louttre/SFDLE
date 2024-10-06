import mongoose from 'mongoose';

// Define the character schema
const WillItKillSchema = new mongoose.Schema({
    video_id: {
        type: String, // Example "y9VE3WKYSy4"
        required: true
    },
    answer: {
        type: Boolean, // True or False
        required: true
    }
})

export const WillItKillModel = mongoose.model('willitkill', WillItKillSchema)