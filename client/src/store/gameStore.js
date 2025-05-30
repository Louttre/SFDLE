import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAchievementStore } from './achievementStore';

const API_URL = "http://localhost:3000/api/char";
axios.defaults.withCredentials = true;

// Function to check if all comparison results are true
function areAllComparisonsTrue(comparisonResults) {
    return Object.values(comparisonResults).every(result => result === true);
}

function getTimeUntilNextMinute() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000);
    nextMinute.setSeconds(0, 0); // Set to the start of the next minute
    const millisecondsUntilReset = nextMinute.getTime() - now.getTime();
    return millisecondsUntilReset / (1000 * 60 * 60 * 24); // Convert to fraction of a day
}
// Helper function to get time until midnight
function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight
    const millisecondsUntilMidnight = midnight.getTime() - now.getTime();
    return millisecondsUntilMidnight / (1000 * 60 * 60 * 24); // Convert to fraction of a day
}

// Zustand store for managing character-related state
const useCharacterStore = create((set) => ({
    input: '',
    suggestions: [],
    selectedCharacter: null,
    comparisonResults: null,
    characterCharacteristics: null,
    characterOfTheDay: null,
    gameCompleted: false,
    gamesCompleted: {
        mainGame: false,
        emojiGame: false,
        blindTest: false,
        willItKill: false,
    },

    // Action to update input and fetch suggestions
    setInput: (input) => {
        set({ input });
        if (input.length > 0) {
            axios.get(`${API_URL}/list-char?name=${input}`)
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
            // Check if all comparison results are true
            const isCorrect = areAllComparisonsTrue(comparisonResponse.data);
            // Update the store with both data points only after both requests succeed
            set({
                characterCharacteristics: characteristicsResponse.data,
                comparisonResults: comparisonResponse.data,
                gameCompleted: isCorrect,
            });
            // If the guess is correct, save the game state to cookies
            if (isCorrect) {
                await useAchievementStore.getState().modifyAchievementProgress('First blood');
                const response = await axios.get(`${API_URL}/char-of-the-day`);
                const gameState = {
                    gameCompleted: true,
                    characterOfTheDay: response.data,
                };
                // Set cookie to expire at midnight
                const expires = getTimeUntilNextMinute();
                Cookies.set('gameState_mainGame', JSON.stringify(gameState), { expires });
            }

        } catch (err) {
            console.error('Error fetching character data:', err);
        }
    },
    getCharacterOfTheDay: async () => {
        try {
            const response = await axios.get(`${API_URL}/char-of-the-day`);
            set({ characterOfTheDay: response.data });
        } catch (error) {
            console.error('Error fetching character of the day:', error);
        }
    },

    setGamesCompleted: (gameName) => set((state) => {
        const updatedGamesCompleted = {
            ...state.gamesCompleted,
            [gameName]: true,
        };
        // Save to cookies
        Cookies.set('gamesCompleted', JSON.stringify(updatedGamesCompleted), { expires: getTimeUntilNextMinute() });
        return { gamesCompleted: updatedGamesCompleted };
    }),

    resetGamesCompleted: () => set((state) => {
        const resetGames = Object.keys(state.gamesCompleted).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {});
        // Save to cookies
        Cookies.set('gamesCompleted', JSON.stringify(resetGames), { expires: getTimeUntilNextMinute() });
        return { gamesCompleted: resetGames };
    }),
    // Load completion status from cookies
    loadGamesCompleted: () => {
        const savedGamesCompleted = Cookies.get('gamesCompleted');
        if (savedGamesCompleted) {
            set({ gamesCompleted: JSON.parse(savedGamesCompleted) });
        }
    },
    // ... other state and actions




}));

export default useCharacterStore;
