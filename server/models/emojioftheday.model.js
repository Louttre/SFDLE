import mongoose from 'mongoose';

// Define the character schema
const emojiOfTheDaySchema = new mongoose.Schema({
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

export const EmojiOfTheDayModel = mongoose.model('EmojiOfTheDay', emojiOfTheDaySchema);