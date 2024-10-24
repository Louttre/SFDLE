import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000"; // API base URL

const useBlindTestStore = create((set, get) => ({
  youtubeLink: null,   // The YouTube link for the character of the day
  gameWon: false,      // Whether the user has won the game
  input: '',           // The user's guess input
  comparedGuess: false, // The result of the comparison between the user's guess and the character of the day
  suggestions: [],     // Suggestions for character names based on user input
  characterOfTheDay: null, // The character of the day

  // Fetch the character of the day (YouTube link)
  getBlindTest: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/char/blind`);
      set({ youtubeLink: response.data.theme_song });
    } catch (error) {
      console.error('Error fetching character of the day YouTube link:', error);
    }
  },
  getCharacterOfTheDay: async () => { 
    try {
        const response = await axios.get(`${API_URL}/api/char/blind-of-the-day`);
        set({ characterOfTheDay: response.data });
    } catch (error) {
        console.error('Error fetching character of the day:', error);
    }
},
  // Compare the user's guess with the character of the day
  compareGuess: async (guess) => {
    try {
      const response = await axios.post(`${API_URL}/api/char/blind-compare`, { guess });
      
      if (response.data) {
        set({ gameWon: true });  // Mark the game as won
        return true;             // Return true if the guess is correct
      } else {
        set({ gameWon: false }); // Ensure game is not won
        return false;            // Return false if the guess is incorrect
      }
    } catch (error) {
      console.error('Error comparing characters:', error);
      return false;
    }
  },

    // Action to update input and fetch suggestions
    setInput: (input) => {
      set({ input });
      if (input.length > 0) {
          axios.get(`${API_URL}/api/char/list-char?name=${input}`)
              .then(response => {
                  set({ suggestions: response.data.suggestions });
              })
              .catch(err => {
                  console.error('Error fetching character suggestions:', err);
              });
      } else {
          set({ suggestions: [] });
      }
  },

  // Action to mark the game as won
  setGameWon: (isWon) => set({ gameWon: isWon }),
}));

export default useBlindTestStore;
