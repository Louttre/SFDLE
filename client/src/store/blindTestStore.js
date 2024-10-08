import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000"; // API base URL

const useBlindTestStore = create((set, get) => ({
  youtubeLink: null,   // The YouTube link for the character of the day
  gameWon: false,      // Whether the user has won the game
  input: '',           // The user's guess input

  // Fetch the character of the day (YouTube link)
  getCharacterOfTheDay: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/char/blind`);
      set({ youtubeLink: response.data.theme_song });
    } catch (error) {
      console.error('Error fetching character of the day YouTube link:', error);
    }
  },

  // Compare the user's guess with the character of the day
  compareGuess: async (guess) => {
    try {
        const response = await axios.post(`${API_URL}/api/char/blind-compare`, { guess });
        set({ comparedGuess: response.data });
        return response.data; // Return the comparison result to be used directly
    } catch (error) {
        console.error('Error comparing characters:', error);
    }
},
  // Action to update the input state
  setInput: (input) => set({ input }),

  // Action to mark the game as won
  setGameWon: (isWon) => set({ gameWon: isWon }),
}));

export default useBlindTestStore;
