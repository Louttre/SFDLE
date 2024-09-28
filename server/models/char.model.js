import mongoose from 'mongoose';

// Define the character schema
const characterSchema = new mongoose.Schema({
    name: {
        type: String, // Example "Chun-Li"
        required: true
    },
    height: {
        type: String, // Keeping it as string to allow formats like "175cm"
        required: true
    },
    weight: {
        type: String, // Keeping it as string for formats like "85kg"
        required: true
    },
    birthplace: {
        type: String, // Example "Japan"
        required: true
    },
    genre: {
        type: String, // Could be 'Male', 'Female', etc.
        required: true
    },
    eye_color: {
        type: [String], // Example "Brown"
        required: true
    },
    fighting_style: {
        type: [String], // Example "Kung Fu"
        required: true
    },
    special_moves: {
        type: [String], // Array of strings for multiple special moves
        required: true
    },
    image: {
        type: String, // URL for the character's image
        required: true
    },
    first_appearance: {
        type: String, // Name of the first game the character appeared in
        required: true
    },
    emoji: {
        type: [String], // Array of emoji strings
        required: true
    },
    theme_song: {
        type: String, // URL to the character's theme song
        required: false // Optional, as some characters might not have a theme song
    }
});


export const CharacterModel = mongoose.model('Character', characterSchema);