import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate for redirection
import "./Loginsfdle.css";
import { useAuthStore } from '../store/authStore';
import { useAchievementStore } from '../store/achievementStore';

export const Loginsfdle = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate(); // Create navigate function
    const { modifyAchievementProgress } = useAchievementStore();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            
            await login(email, password);
            modifyAchievementProgress("Hello there!");
            // Redirect to the main page or any other after successful login
            navigate('/main');
        } catch (err) {
            // Handle the error if needed
            console.error("Login failed:", err);
        }
    };

    return (
        <div id="overlay" className="absolute h-full w-full max-w-[400px] p-2 bg-black/60 backdrop-blur-lg flex items-center justify-center">
            <div id="frame2" className="relative w-full px-8 py-2 flex flex-col ">
                <div id="frame4" className="relative w-full flex flex-col gap-8 mx-auto">
                    <div id="connexion" className="text-white text-left text-[32px] font-roboto font-bold">
                        CONNEXION
                    </div>

                    <form id="frame5" className="flex flex-col gap-8" onSubmit={handleLogin}>
                        <div id="frame6" className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-white text-[20px] font-inter">
                                EMAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="text-white bg-transparent border-b border-white focus:outline-none"
                                autoComplete="on"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div id="frame7" className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-white text-[20px] font-inter">
                                MOT DE PASSE
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="text-white bg-transparent border-b border-white focus:outline-none"
                                value={password}
                                autoComplete="on"
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center mt-2">
                                {error}
                            </div>
                        )}

                        <button
                            id="connexion2"
                            className="bg-white h-[40px] rounded-[25px] flex justify-center items-center text-black text-[20px] font-roboto w-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 active:scale-95"
                            type="button"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Connexion"}
                        </button>

                    </form>

                    <div id="motdepasseoublié?" className="text-white text-center text-[20px] font-roboto">
                        Mot de passe oublié ?
                    </div>
                </div>
                <div id="pasencoredecompte?s’inscrire" className="text-left text-[16px] mx-auto text-gray-300">
                    Don't have an account ? <Link className="text-red-300" to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Loginsfdle;
