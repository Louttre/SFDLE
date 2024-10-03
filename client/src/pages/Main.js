import React, { useState } from 'react';
import './main.css';
import { motion } from "framer-motion";
import MainGame from "./MainGame"
import WillItKill from './WillItKill';
import EmojiGame from './EmojiGame';
import BlindTest from './BlindTest';
import SilhouetteGame from './SilhouetteGame';


const Main = () => {
    // State to track which game is selected
    const [selectedGame, setSelectedGame] = useState(null);

    // Function to handle button click
    const handleGameSelect = (game) => {
        setSelectedGame(game);  // Set the selected game when a button is clicked
    };

    return (
        <div className="background-container">
            <div className="background-img">
                {/* Conditionally render buttons if no game is selected */}
                {!selectedGame && (
                    <div className='button-container'>
                        <motion.button onClick={() => handleGameSelect('Main Game')} whileHover={{ scale: 1.1 }} className="game-button">
                            Main Game
                        </motion.button>
                        <motion.button onClick={() => handleGameSelect('Will It Kill')} whileHover={{ scale: 1.1 }} className="game-button">
                            Will It Kill
                        </motion.button>
                        <motion.button onClick={() => handleGameSelect('Emoji')} whileHover={{ scale: 1.1 }} className="game-button">
                            Emoji
                        </motion.button>
                        <motion.button onClick={() => handleGameSelect('Blind Test')} whileHover={{ scale: 1.1 }} className="game-button">
                            Blind Test
                        </motion.button>
                        <motion.button onClick={() => handleGameSelect('Silhouette')} whileHover={{ scale: 1.1 }} className="game-button">
                            Silhouette
                        </motion.button>
                    </div>
                )}
                {/* Conditionally render the selected game content */}
                {selectedGame === 'Main Game' && <MainGame />}
                {selectedGame === 'Will It Kill' && <WillItKill />}
                {selectedGame === 'Emoji' && <EmojiGame />}
                {selectedGame === 'Blind Test' && <BlindTest />}
                {selectedGame === 'Silhouette' && <SilhouetteGame />}
            </div>
        </div>
    );
};

export default Main;