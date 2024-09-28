import mongoose from 'mongoose';

// Define the character schema
const characterOfTheDaySchema = new mongoose.Schema({
    character: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character', // Reference to the Character model
        required: false
    },
    prevcharacter: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Character', // Reference to the Characters model
        required: true
    }
})

export const CharOfTheDayModel = mongoose.model('CharOfTheDay', characterOfTheDaySchema);