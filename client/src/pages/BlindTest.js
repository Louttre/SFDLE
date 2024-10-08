import React, { useState, useEffect, useRef } from 'react';
import useBlindTestStore from '../store/blindTestStore'; // Import the zustand store

const BlindTest = () => {
  const {
    youtubeLink,           // The YouTube link of the character of the day
    getCharacterOfTheDay,   // Action to retrieve the character's YouTube link
    compareGuess,           // Function to compare the user's guess
    gameWon,                // Whether the user has won the game
    setGameWon,             // Action to update the game won state
    input,                  // Input state (for guessing)
    setInput,               // Action to update the input
  } = useBlindTestStore();

  const [volume, setVolume] = useState(0.5); // State for the volume control
  const audioRef = useRef(null); // Reference to the audio element

  useEffect(() => {
    // Fetch the character of the day (YouTube link) when the component mounts
    getCharacterOfTheDay();
  }, [getCharacterOfTheDay]);

  // Handle play/pause functionality
  const handlePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume; // Set the audio volume
  };

  // Handle the user's guess
  const handleGuess = () => {
    const isCorrect = compareGuess(input);
    if (isCorrect) {
      setGameWon(true); // Mark the game as won
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Guess the Character from the Music</h2>

      {/* Audio Controls */}
      {youtubeLink && (
        <div>
          <audio ref={audioRef} src={youtubeLink} />
          <button onClick={handlePlayPause}>Play/Pause</button>
          <br />

          {/* Volume control */}
          <label>Volume: </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      )}

      {/* Guessing input */}
      {!gameWon && (
        <div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)} // Update the input field
            placeholder="Type your guess..."
            style={{ padding: '10px', width: '200px' }}
          />
          <button onClick={handleGuess}>Submit Guess</button>
        </div>
      )}

      {/* Congratulation message if the game is won */}
      {gameWon && <h3>Congratulations! You guessed the character!</h3>}
    </div>
  );
};

export default BlindTest;
