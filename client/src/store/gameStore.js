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

    // Action to select a character and fetch comparison results
    selectCharacter: (character) => {

        set({ selectedCharacter: character });
        axios.post(`${API_URL}/compare`, ({ guess: character }))
            .then(response => {
                //console.log(response.data)
                set({ comparisonResults: response.data });
            })
            .catch(err => {
                console.error('Error fetching comparison results:', err);
            });
            axios.post(`${API_URL}/characteristics`, ({ name: character }))
            .then(response => {
                //console.log(response.data); // Log the response data
                set({ characterCharacteristics: response.data });
            })
            .catch(err => {
                console.error('Error retrieving character characteristics:', err);
            });
    },

    getcharacteristics: (character) => {
        // Use params to send character name as query parameter
        axios.post(`${API_URL}/characteristics`, ({ name: character }))
            .then(response => {
                //console.log(response.data); // Log the response data
                set({ characterCharacteristics: response.data });
            })
            .catch(err => {
                console.error('Error retrieving character characteristics:', err);
            });
    },
}));

export default useCharacterStore;
