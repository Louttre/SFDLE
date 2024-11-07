import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000/api/achiev";

const useLeaderboardStore = create((set) => ({
  leaderboardData: [],
  totalAchievements: 0,
  loading: false,
  error: null,

  fetchLeaderboard: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(`${API_URL}/leaderboard`)

      const { leaderboard, totalAchievements } = response.data;

      set({
        leaderboardData: leaderboard,
        totalAchievements,
        loading: false,
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      set({ error: error.message, loading: false });
    }
  },
}));

export default useLeaderboardStore;
