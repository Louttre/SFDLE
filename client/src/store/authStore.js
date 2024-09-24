import { create } from 'zustand';
import axios from 'axios';

const API_URL = "http://localhost:3000/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuth: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,

    signup: async (email, password, username) => {
        set({ isLoading: true , error: null });
        try{
            const response = await axios.post(`${API_URL}/register`, { email, password, username });
            set({ user: response.data.user, isAuth: true , isLoading: false });
        }
        catch (error) {
            set({ error: error.response.data.message || "Error signing up", isLoading: false });
            throw error;
        }
    },
    verifyEmail : async (verificationCode) => {
        set({ isLoading: true , error: null });
        try{
            const response = await axios.post(`${API_URL}/verify-email`, { code: verificationCode });
            set({ isLoading: false });
            return response.data;
        }
        catch (error) {
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
        }
    },
    checkAuth: async () => {
        set({ isCheckingAuth: true , error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuth: true , isCheckingAuth: false });
        } catch (error) {
            set({ error: null, isAuth: false , isCheckingAuth: false });
        }
    },
    login: async (email, password) => {
        set({ isLoading: true , error: null });
        try{
            const response = await axios.post(`${API_URL}/login`, { email, password });
            set({ user: response.data.user, isAuth: true , isLoading: false, error: null });
            console.log(response);
        }
        catch (error) {
            set({ error: error.response.data.message || "Error logging in", isLoading: false });
            throw error;
        }
    },
    forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
    resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}))