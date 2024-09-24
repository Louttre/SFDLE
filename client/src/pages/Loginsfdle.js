import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div id="overlay" className="absolute h-full w-full max-w-[400px] p-2 bg-black/60 backdrop-blur-lg flex items-center justify-center">
            <div id="frame2" className="relative w-full px-8 py-2 flex flex-col ">
                <div id="frame4" className="relative w-full flex flex-col gap-8 mx-auto">
                    <div id="connexion" className="text-white text-left text-[32px] font-roboto font-bold">
                        CONNEXION
                    </div>

                    <div id="frame5" className="flex flex-col gap-8">
                        <div id="frame6" className="flex flex-col gap-2">
                            <label htmlFor="email" className="text-white text-[20px] font-inter">
                                EMAIL
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Entrez votre email"
                                className="text-white bg-transparent border-b border-white focus:outline-none"
                            />
                        </div>

                        <div id="frame7" className="flex flex-col gap-2">
                            <label htmlFor="password" className="text-white text-[20px] font-inter">
                                MOT DE PASSE
                            </label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Entrez votre mot de passe"
                                className="text-white bg-transparent border-b border-white focus:outline-none"
                            />
                        </div>
                    </div>

                    <div id="frame3" className="bg-white h-[40px] rounded-[25px] flex justify-center items-center">
                        <div id="connexion2" className="text-black text-[20px] font-roboto">
                            Connexion
                        </div>
                    </div>

                    <div id="motdepasseoublié?" className="text-white text-center text-[20px] font-roboto">
                        Mot de passe oublié ?
                    </div>
                </div>
                <div id="pasencoredecompte?s’inscrire" className="text-left text-[16px] mx-auto text-gray-300">
                        Pas encore de compte ? <Link className="text-red-300" to="/register">S’inscrire</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
