import { create } from 'zustand';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Cookie } from 'lucide-react';

const API_URL = "http://localhost:3000/api/willitkill";
axios.defaults.withCredentials = true;

function getTimeUntilNextMinute() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000);
    nextMinute.setSeconds(0, 0); // Set to the start of the next minute
    const millisecondsUntilReset = nextMinute.getTime() - now.getTime();
    return millisecondsUntilReset / (1000 * 60 * 60 * 24); // Convert to fraction of a day
}

// Zustand store for managing character-related state
const useWillItKillStore = create((set) => ({
    video_id:'',
    useranswer:null,
    answer:null,
    killornot:null,
    gameSuccess: false,

    getVideo: async () => {
        try {
            await axios.get(`${API_URL}/video-id`)
                .then(response => {
                    set ({video_id: response.data})
                })
                .catch(err => {
                    console.error('Error fetching video id:', err);
                });
        } catch(err){
            console.error('Error fetching video data:', err);
        }
    },
    userAnswer: async (guess) => {
        set({ useranswer: guess });
        try {
            const response = await axios.post(`${API_URL}/compare`, { answer: guess });
            set({ answer: response.data });
            if (response.data === true) {
                Cookies.set('gameSuccess', true, { expires: getTimeUntilNextMinute() });
            }
            return response.data; // Return the response data
        } catch (err) {
            console.error('Error retrieving answer:', err);
            return null; // Return null or rethrow the error
        }
    },
    killOrNot: async () => {
        try {
            const response = await axios.get(`${API_URL}/killornot`);
            set({ killornot: response.data });
            return response.data; // Return the response data
        } catch (err) {
            console.error('Error retrieving kill or not:', err);
            return null; // Return null or rethrow the error
        }
    },
    
}));

export default useWillItKillStore;
