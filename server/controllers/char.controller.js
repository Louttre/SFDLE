import { CharacterModel } from '../models/char.model.js';
import { CharOfTheDayModel } from '../models/charoftheday.model.js';
import { EmojiOfTheDayModel } from '../models/emojioftheday.model.js';
import { BlindOfTheDayModel } from '../models/blindoftheday.model.js';
import { eyeCompare, fightingStyleCompare, heightWeightCompare } from '../utils/compareFunc.js';

export const getAllChars = async (req, res) => {
    try {
        const characters = await CharacterModel.find().select('name');
        res.status(200).json(characters);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getCharacterByName = async (req, res) => {
    const { name } = req.query;
    try {
        const character = await CharacterModel.findOne({ name }).select('name image');
        if (!character) {
            return res.status(404).json({ message: 'Character not found' });
        }
        res.json(character);
    } catch (error) {
        console.error('Error retrieving character:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getListChars = async (req, res) => {
    const { name } = req.query;

    try {
        // Use regex to search for characters by name (case insensitive)
        const regex = new RegExp(`^${name}`, 'i');
        const chars = await CharacterModel.find({ name: regex });

        // Map over characters to return both name and imageUrl
        const charSuggestions = chars.map(char => ({
            name: char.name,
            image: char.image, // Assuming your model has an imageUrl field
        }));

        // Send the response with name and image for each character
        res.json({ suggestions: charSuggestions });
        console.log(charSuggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const selectCharacterOfTheDay = async () => {
    try {
        // Fetch the existing document
        let charOfTheDayDoc = await CharOfTheDayModel.findOne();

        // If no document exists, create one
        if (!charOfTheDayDoc) {
            charOfTheDayDoc = new CharOfTheDayModel();
        }

        // Get total number of characters
        const totalCharacters = await CharacterModel.countDocuments();

        // Initialize prevcharacter if undefined
        if (!charOfTheDayDoc.prevcharacter) {
            charOfTheDayDoc.prevcharacter = [];
        }

        // Check if all characters have been used
        if (charOfTheDayDoc.prevcharacter.length >= totalCharacters) {
            charOfTheDayDoc.prevcharacter = []; // Reset the previous characters
        }

        // Fetch characters not in prevCharacters
        const availableCharacters = await CharacterModel.find({
            _id: { $nin: charOfTheDayDoc.prevcharacter },
        });

        // No available characters
        if (availableCharacters.length === 0) {
            throw new Error('No available characters to select.');
        }

        // Select a random character
        const randomCharacter =
            availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

        // Update the document with the new character
        charOfTheDayDoc.character = randomCharacter._id;

        // Add selected character to prevCharacters
        charOfTheDayDoc.prevcharacter.push(randomCharacter._id);

        // Update the date (optional)
        charOfTheDayDoc.date = new Date();

        // Save the document
        await charOfTheDayDoc.save();


    } catch (error) {
        console.error('Error selecting character of the day:', error);
    }
};

export const getCharOfTheDay = async (req, res) => {
    try {
        // Fetch the existing document
        const charOfTheDayDoc = await CharOfTheDayModel.findOne();

        if (!charOfTheDayDoc || !charOfTheDayDoc.character) {
            return res.status(404).json({ message: 'Blind of the day not found.' });
        }

        // Fetch the character's theme song
        const character = await CharacterModel.findById(charOfTheDayDoc.character).select('name image');

        res.json(character);
    } catch (error) {
        console.error('Error retrieving Blind of the day:', error);
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

export const getCharacter = async (req, res) => {
    // Use req.query to get the name parameter
    const { name } = req.body; // Change from req.body to req.query
    try {
        const char = await CharacterModel.findOne({ name: name }).select('-special_moves -emoji -theme_song -_id');
        res.json(char); // Send back the character data
    } catch (error) {
        console.error('Error retrieving character:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const selectEmojiOfTheDay = async () => {
    try {
        // Fetch the existing document
        let emojiDoc = await EmojiOfTheDayModel.findOne();

        // If no document exists, create one
        if (!emojiDoc) {
            emojiDoc = new EmojiOfTheDayModel();
        }

        // Get total number of characters
        const totalCharacters = await CharacterModel.countDocuments();

        // Initialize prevcharacter if undefined
        if (!emojiDoc.prevcharacter) {
            emojiDoc.prevcharacter = [];
        }

        // Check if all characters have been used
        if (emojiDoc.prevcharacter.length >= totalCharacters) {
            emojiDoc.prevcharacter = []; // Reset the previous characters
        }

        // Fetch characters not in prevcharacter
        const availableCharacters = await CharacterModel.find({
            _id: { $nin: emojiDoc.prevcharacter },
        }).select('-special_moves -height -weight -birthplace -genre -eye_color -fighting_style -image -first_appearance -theme_song');

        // No available characters
        if (availableCharacters.length === 0) {
            throw new Error('No available characters to select.');
        }

        // Select a random character
        const randomCharacter =
            availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

        // Update the document with the new character
        emojiDoc.character = randomCharacter._id;

        // Add selected character to prevcharacter
        emojiDoc.prevcharacter.push(randomCharacter._id);

        // Update the date (optional)
        emojiDoc.date = new Date();

        // Save the document
        await emojiDoc.save();

        console.log('Emoji of the day updated successfully.');

    } catch (error) {
        console.error('Error selecting Emoji of the day:', error);
    }
};

export const getEmojiOfTheDay = async (req, res) => {
    try {
        // Fetch the existing document
        const emojiDoc = await EmojiOfTheDayModel.findOne();
        const characterOfTheDay = await CharacterModel.findById(emojiDoc.character).select('name image');

        if (!emojiDoc || !characterOfTheDay) {
            return res.status(404).json({ message: 'Emoji of the day not found.' });
        }

        // Fetch the character's emoji
        res.json(characterOfTheDay);
    } catch (error) {
        console.error('Error retrieving emoji of the day:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEmoji = async (req, res) => {
    try {
        const characterIdOfTheDay = await EmojiOfTheDayModel.findOne();
        const characterOfTheDay = await CharacterModel.findById(characterIdOfTheDay.character).select('emoji');

        res.json(characterOfTheDay);
    } catch (error) {
        console.error('Error retrieving emoji:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const compareEmoji = async (req, res) => {
    try {
        const { guess } = req.body;

        // Fetch the character of the day and the guessed character
        const characterIdOfTheDay = await EmojiOfTheDayModel.findOne();

        const characterOfTheDay = await CharacterModel.findById(characterIdOfTheDay.character);
        const guessedCharacter = await CharacterModel.findOne({
            name: guess
        });
        if (!characterOfTheDay || !guessedCharacter) {
            return res.status(404).json({ message: 'Character not found' });
        }

        // Compare the characters
        const comparison = characterOfTheDay.name === guessedCharacter.name;
        res.json(comparison);
    } catch (error) {
        console.error('Error comparing characters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getBlind = async (req, res) => {
    try {
        const characterIdOfTheDay = await BlindOfTheDayModel.findOne();
        const characterOfTheDay = await CharacterModel.findById(characterIdOfTheDay.character).select('theme_song');

        res.json(characterOfTheDay);
    } catch (error) {
        console.error('Error retrieving emoji:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const selectBlindOfTheDay = async () => {
    try {
        // Fetch the existing document
        let blindDoc = await BlindOfTheDayModel.findOne();

        // If no document exists, create one
        if (!blindDoc) {
            blindDoc = new BlindOfTheDayModel();
        }

        // Get total number of characters with a theme song
        const totalCharacters = await CharacterModel.countDocuments({ theme_song: { $ne: '' } });

        // Initialize prevcharacter if undefined
        if (!blindDoc.prevcharacter) {
            blindDoc.prevcharacter = [];
        }

        // Check if all characters have been used
        if (blindDoc.prevcharacter.length >= totalCharacters) {
            blindDoc.prevcharacter = []; // Reset the previous characters
        }

        // Fetch characters not in prevcharacter with a theme song
        const availableCharacters = await CharacterModel.find({
            _id: { $nin: blindDoc.prevcharacter },
            theme_song: { $ne: '' },
        }).select('-special_moves -height -weight -birthplace -genre -eye_color -fighting_style -image -first_appearance -emoji');

        // No available characters
        if (availableCharacters.length === 0) {
            throw new Error('No available characters to select.');
        }

        // Select a random character
        const randomCharacter =
            availableCharacters[Math.floor(Math.random() * availableCharacters.length)];

        // Update the document with the new character
        blindDoc.character = randomCharacter._id;

        // Add selected character to prevcharacter
        blindDoc.prevcharacter.push(randomCharacter._id);

        // Update the date (optional)
        blindDoc.date = new Date();

        // Save the document
        await blindDoc.save();

        console.log('Blind of the day updated successfully.');

    } catch (error) {
        console.error('Error selecting Blind of the day:', error);
    }
};

export const getBlindOfTheDay = async (req, res) => {
    try {
        // Fetch the existing document
        const blindDoc = await BlindOfTheDayModel.findOne();

        if (!blindDoc || !blindDoc.character) {
            return res.status(404).json({ message: 'Blind of the day not found.' });
        }

        // Fetch the character's theme song
        const character = await CharacterModel.findById(blindDoc.character).select('name image');

        res.json(character);
    } catch (error) {
        console.error('Error retrieving Blind of the day:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const compareBlind = async (req, res) => {
    try {
        const { guess } = req.body;

        // Fetch the character of the day and the guessed character
        const characterIdOfTheDay = await BlindOfTheDayModel.findOne();

        const characterOfTheDay = await CharacterModel.findById(characterIdOfTheDay.character);
        const guessedCharacter = await CharacterModel.findOne({
            name: guess
        });
        console.log(characterOfTheDay);

        if (!characterOfTheDay || !guessedCharacter) {
            return res.status(404).json({ message: 'Character not found' });
        }

        // Compare the characters
        const comparison = characterOfTheDay.name === guessedCharacter.name;
        res.json(comparison);
    } catch (error) {
        console.error('Error comparing characters:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};