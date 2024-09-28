import { CharacterModel } from '../models/char.model.js';
import { CharOfTheDayModel } from '../models/charoftheday.model.js';
import { eyeCompare, fightingStyleCompare, heightWeightCompare } from '../utils/compareFunc.js';

export const getAllChars = async (req, res) => {
    try {
        const characters = await CharacterModel.find();
        res.status(200).json(characters);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getCharOfTheDay = async (req, res) => {
    try {
        // Check for the character of the day document
        let characterOfTheDay = await CharOfTheDayModel.findOne();
        
        // total number of characters
        const totalCharacters = await CharacterModel.countDocuments();

        // If no document exists, create a new one
        if (!characterOfTheDay) {
            characterOfTheDay = new CharOfTheDayModel();
        }

        // Check if all the characters have been selected
        if (characterOfTheDay.prevcharacter.length >= totalCharacters) {
            characterOfTheDay.prevcharacter = []; // Reset the previous characters
        }

        // Fetch a character that is not in prevcharacter
        const availableCharacters = await CharacterModel.find({
            _id: { $nin: characterOfTheDay.prevcharacter }
        });
        
        // No available characters
        if (availableCharacters.length === 0) {
            return res.status(400).json({ message: "No available characters." });
        }

        // Select a random character
        const randomCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

        // Update characterOfTheDay with the new character
        characterOfTheDay.character = randomCharacter._id; // Update the character field
        characterOfTheDay.prevcharacter.push(randomCharacter._id); // Add to the previous character array

        await characterOfTheDay.save(); // Save the updated document

        // Return the character of the day
        return res.json(randomCharacter);
    } catch (error) {
        console.error('Error selecting character of the day:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const compareChar = async (req, res) => {
    try {
        const { guess } = req.body;

        // Fetch the character of the day and the guessed character
        const characterIdOfTheDay = await CharOfTheDayModel.findOne();

        const characterOfTheDay = await CharacterModel.findById(characterIdOfTheDay.character);
        const guessedCharacter = await CharacterModel.findOne({
            name: guess
        });

        if (!characterOfTheDay || !guessedCharacter) {
            return res.status(404).json({ message: 'Character not found' });
        }

        // Compare the characters
        const comparison = {
            height: heightWeightCompare(characterOfTheDay.height, guessedCharacter.height),
            weight: heightWeightCompare(characterOfTheDay.weight, guessedCharacter.weight),
            birthplace: characterOfTheDay.birthplace === guessedCharacter.birthplace,
            genre: characterOfTheDay.genre === guessedCharacter.genre,
            eye_color: eyeCompare(characterOfTheDay.eye_color, guessedCharacter.eye_color),
            fighting_style: fightingStyleCompare(characterOfTheDay.fighting_style, guessedCharacter.fighting_style),
            first_appearance: characterOfTheDay.first_appearance === guessedCharacter.first_appearance
        };
        res.json(comparison);
    } catch (error) {
        console.error('Error comparing characters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};