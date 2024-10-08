import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000/api/char";
axios.defaults.withCredentials = true;

// Zustand store for managing character-related state
const useCharacterStore = create((set) => ({
    input: '',
    suggestions: [],
    selectedCharacter: null,
    comparisonResults: null,
    characterCharacteristics: null,

    // Action to update input and fetch suggestions
    setInput: (input) => {
        set({ input });
        if (input.length > 0) {
            axios.get(`${API_URL}/list-char?name=${input}`)
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
    clearInput: () => {
        set({ input: '', suggestions: [] }); // Clear both input and suggestions
    },

    // Combined action to select a character and fetch both characteristics and comparison results
    selectCharacterAndFetchData: async (character) => {
        try {
            // Set the selected character
            set({ selectedCharacter: character });

            // Fetch both characteristics and comparison results concurrently
            const [characteristicsResponse, comparisonResponse] = await Promise.all([
                axios.post(`${API_URL}/characteristics`, { name: character }),
                axios.post(`${API_URL}/compare`, { guess: character })
            ]);

            // Update the store with both data points only after both requests succeed
            set({
                characterCharacteristics: characteristicsResponse.data,
                comparisonResults: comparisonResponse.data
            });

        } catch (err) {
            console.error('Error fetching character data:', err);
        }
    },
}));

export default useCharacterStore;
