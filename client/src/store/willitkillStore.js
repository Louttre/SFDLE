import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000/api/willitkill";
axios.defaults.withCredentials = true;


// Zustand store for managing character-related state
const useWillItKillStore = create((set) => ({
    video_id:'',
    useranswer:null,
    answer:null,
    killornot:null,

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
    useranswer: async (guess) => {
        await axios.post(`${API_URL}/compare`)
            .then(response => {
                set({answer: response.data})
            })
            .catch(err => {
                console.error('Error retrieving answer:', err);
            })
    },
    killornot: async () => {
        await axios.get(`${API_URL}/killornot`)
            .then(response => {
                set({killornot: response.data})
            })
            .catch(err => {
                console.error('Error retrieving answer:', err);
            })
    },
    
}));

export default useWillItKillStore;
