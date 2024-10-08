import { create } from 'zustand';
import axios from 'axios'; // Axios for API requests

const API_URL = "http://localhost:3000";

const useEmojiStore = create((set, get) => ({
    input: '',
    character: null,          // Current character (character of the day)
    revealedEmojis: [],       // The emojis currently revealed
    wrongGuessCount: 0,       // Track wrong guesses
    gameWon: false,           // Flag for game status
    suggestions: [],
    comparedGuess: null,      // Stores the comparison result

    // Fetch the character of the day from the API
    getCharacter: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/char/emo`);
            const character = response.data;

            // Initialize the game with the first emoji revealed
            set({
                character: character,
                revealedEmojis: [character.emoji[0], "❓", "❓"],
                wrongGuessCount: 0,
                gameWon: false,
            });
        } catch (error) {
            console.error('Error fetching character of the day:', error);
        }
    },

    compareGuess: async (guess) => {
        try {
            const response = await axios.post(`${API_URL}/api/char/emo-compare`, { guess });
            set({ comparedGuess: response.data });
            return response.data; // Return the comparison result to be used directly
        } catch (error) {
            console.error('Error comparing characters:', error);
        }
    },

    // Action to update input and fetch suggestions
    setInput: (input) => {
        set({ input });  // Update the input field
        if (input.length > 0) {
            axios.get(`${API_URL}/api/char/list-char?name=${input}`)
                .then(response => {
                    set({ suggestions: response.data.names });
                })
                .catch(err => {
                    console.error('Error fetching character suggestions:', err);
                });
        } else {
            set({ suggestions: [] });
        }
    },

    // Action to clear the input
    clearinput: () => {
        set({ input: '', suggestions: [] }); // Clear both input and suggestions
    },
}));

export default useEmojiStore;
