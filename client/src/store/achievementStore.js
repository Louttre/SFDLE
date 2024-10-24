import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';  // Import react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import toastify styles

const API_URL = 'http://localhost:3000/api/achiev';

axios.defaults.withCredentials = true;

export const useAchievementStore = create((set) => ({
    achievements: [], // List of achievements
    isLoading: false,  // Loading state for fetching achievements
    error: null,       // Error handling state

    // Fetch user achievements (GET /user-achievements)
    fetchUserAchievements: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(`${API_URL}/getuserachievements`);
            set({ achievements: response.data, isLoading: false });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error fetching achievements',
                isLoading: false,
            });
        }
    },

    // Update achievement progress (POST /modify-achievement)
    modifyAchievementProgress: async (achievementName) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/modifyachievement`, {
                achievementName,
            });
            if (response.data.completed) {
                // Achievement just completed, show notification with toast
                toast.success(`Achievement Unlocked: ${achievementName}`, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            set({ isLoading: false });
            // Re-fetch achievements to get updated progress
            await useAchievementStore.getState().fetchUserAchievements();
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Error updating achievement',
                isLoading: false,
            });
        }
    },
}));
