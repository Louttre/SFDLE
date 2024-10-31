import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player'; // Import react-player
import useBlindTestStore from '../store/blindTestStore'; // Import the zustand store
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import './BlindTest.css'; // Import the CSS file for styling
import Input from '../components/input'; // Import your Input component
import { VenetianMask } from 'lucide-react'; // Import an icon
import useCharacterStore from '../store/gameStore'; // Import the game store
import { Link } from 'react-router-dom';
import HoverButton from '../components/HoverButton'; // Import HoverButton component

const BlindTest = () => {
  const {
    youtubeLink,           // The YouTube link of the character of the day
    getBlindTest,          // Action to retrieve the character's YouTube link
    compareGuess,          // Function to compare the user's guess
    gameWon,               // Whether the user has won the game
    setGameWon,            // Action to update the game won state
    input,                 // Input state (for guessing)
    setInput,              // Action to update the input
    suggestions,           // Suggestions for character names based on user input
    characterOfTheDay,     // The character of the day
    getCharacterOfTheDay,  // Action to retrieve the character of the day
  } = useBlindTestStore();

  const { setGamesCompleted } = useCharacterStore(); // Import setGameCompleted

  const [volume, setVolume] = useState(0.1);            // State for volume control
  const [isPlaying, setIsPlaying] = useState(false);    // Control playback state
  const [played, setPlayed] = useState(0);              // Track the progress of the audio (0 to 1)
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [guessHistory, setGuessHistory] = useState([]); // State for guess history
  const [gameCompleted, setGameCompleted] = useState(false); // State for game completion
  const [isLoading, setIsLoading] = useState(true);     // State for loading

  const imageRef = useRef(null);
  const playerRef = useRef(null); // Ref for ReactPlayer

  // Initialize the game on component mount
  useEffect(() => {
    const initializeGame = async () => {
      await getCharacterOfTheDay();
      await getBlindTest(); // Fetch the character's YouTube link
      setIsLoading(false); // Set loading to false after fetching
    };
    initializeGame();

    // Load guess history from cookies
    const savedGuessHistory = Cookies.get('guessHistory_blindTest');
    if (savedGuessHistory) {
      setGuessHistory(JSON.parse(savedGuessHistory));
    }

    // Load gameCompleted from cookies
    const completed = Cookies.get('gameCompleted_blindTest') === 'true';
    setGameCompleted(completed);

    // Load gameWon from cookies
    const won = Cookies.get('gameWon_blindTest') === 'true';
    setGameWon(won);
  }, [getBlindTest]);

  // Save guess history to cookies whenever it changes
  useEffect(() => {
    Cookies.set('guessHistory_blindTest', JSON.stringify(guessHistory), { expires: getTimeUntilNextMinute() });
  }, [guessHistory]);

  // Save gameCompleted to cookies whenever it changes
  useEffect(() => {
    Cookies.set('gameCompleted_blindTest', gameCompleted.toString(), { expires: getTimeUntilNextMinute() });
  }, [gameCompleted]);

  // Save gameWon to cookies whenever it changes
  useEffect(() => {
    Cookies.set('gameWon_blindTest', gameWon.toString(), { expires: getTimeUntilNextMinute() });
  }, [gameWon]);

  // Function to calculate cookie expiration
  function getTimeUntilNextMinute() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000);
    nextMinute.setSeconds(0, 0); // Set to the start of the next minute
    const millisecondsUntilReset = nextMinute.getTime() - now.getTime();
    return millisecondsUntilReset / (1000 * 60 * 60 * 24); // Convert to fraction of a day
  }

  // Handle play/pause functionality
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying); // Toggle the play/pause state
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume); // Update the volume state
  };

  // Handle seeking the audio timeline
  const handleSeek = (e) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);                // Update the played state
    playerRef.current.seekTo(newPlayed); // Seek to the new position
  };

  // Update the played state as the audio progresses
  const handleProgress = (state) => {
    setPlayed(state.played); // Update the timeline progress
  };

  // Handle the user's guess
  const handleGuess = async (characterName) => {
    if (gameCompleted) {
      // Prevent further guesses if the game is completed
      return;
    }

    try {
      const isCorrect = await compareGuess(characterName); // Compare the guess and wait for the result

      // Fetch character data
      const response = await fetch(`http://localhost:3000/api/char/getCharacterByName?name=${encodeURIComponent(characterName)}`);
      const characterData = await response.json();
      console.log(characterData);

      // Update guess history
      setGuessHistory(prevHistory => [...prevHistory, { guess: characterName, isCorrect, character: characterData }]);

      if (isCorrect) {
        setGameCompleted(true);
        setGameWon(true);
        setErrorMessage(''); // Clear any error messages
        setGamesCompleted('blindTest');
      } else {
        setErrorMessage('Wrong guess. Try again!'); // Show error message if incorrect
      }

      setInput(''); // Clear the input field
    } catch (error) {
      console.error('Error handling guess:', error);
      setErrorMessage('An error occurred. Please try again later.');
    }
  };

  // Render the suggestion list with images and names
  const listSuggestion = (suggestions) => {
    return Array.isArray(suggestions) && suggestions.length > 0 ? (
      suggestions.map((suggestion, index) => (
        <li key={index} onClick={() => handleGuess(suggestion.name)} className="suggestion-item">
          <img src={`${process.env.PUBLIC_URL}/img/characters-square/${suggestion.image}`} alt={suggestion.name} className="suggestion-image" />
          {suggestion.name}
        </li>
      ))
    ) : (
      <div></div> // Handle the case of no suggestions
    );
  };

  // Handle mouse movement over the image for tilt effect
  const handleMouseMove = (e) => {
    const image = imageRef.current;
    const rect = image.getBoundingClientRect();

    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    const percentX = deltaX / centerX; // -1 to 1
    const percentY = deltaY / centerY; // -1 to 1

    const maxTilt = 25; // degrees

    const rotateY = percentX * maxTilt;
    const rotateX = -percentY * maxTilt;

    // Set CSS variables for rotation angles
    image.style.setProperty('--rotateX', `${rotateX}deg`);
    image.style.setProperty('--rotateY', `${rotateY}deg`);
  };

  // Reset tilt when mouse leaves the image
  const handleMouseLeave = () => {
    const image = imageRef.current;
    image.style.setProperty('--rotateX', `0deg`);
    image.style.setProperty('--rotateY', `0deg`);
  };

  if (isLoading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className='blind-test-container'>
        <h1 className='blind-test-title'>BLIND TEST</h1>
        <div className='player-controls'>
          {/* ReactPlayer for YouTube link as audio */}
          {youtubeLink && (
            <div style={{ display: 'none' }}>
              {/* Hide the video player visually */}
              <ReactPlayer
                ref={playerRef}               // Reference to ReactPlayer
                url={youtubeLink}             // YouTube video link
                playing={isPlaying}           // Whether the video is playing
                volume={volume}               // Volume control
                onProgress={handleProgress}   // Update the timeline as it plays
                height="0px"                  // Hide the video player
                width="0px"                   // Hide the video player
              />
            </div>
          )}

          {/* Play/Pause, Volume, and Timeline Control */}
          <div className="controls">
            <button onClick={handlePlayPause} className='play-pause-button' aria-label="Play or Pause">
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <label htmlFor="progress">Progress: </label>
            <input
              id="progress"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={played}
              onChange={handleSeek} // Seek to the new time
              className="progress-slider"
              aria-label="Progress Slider"
            />

            {/* Volume control */}
            <label htmlFor="volume">Volume: </label>
            <input
              id='volume'
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume Control"
            />
          </div>
        </div>

        {/* Input and suggestions */}
        {!gameCompleted && (
          <div className="input-section">
            <Input
              icon={VenetianMask}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your guess..."
            />
            <ul className="listSuggestions">
              {listSuggestion(suggestions)}
            </ul>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        )}
      </div>

      {/* Guess History */}
      <div className="guess-history">
        <div className='guesses'>
          {guessHistory.map((guessItem, index) => (
            <div
              key={index}
              className={`guess-item ${guessItem.isCorrect ? 'correct' : 'incorrect'}`}
            >
              {guessItem.character ? (
                <>
                  <img
                    className='guess-item-image'
                    src={`${process.env.PUBLIC_URL}/img/characters-square/${guessItem.character.image}`}
                    alt={guessItem.character.name}
                  />
                  <div className='guess-item-name'>{guessItem.character.name}</div>
                </>
              ) : (
                <div className='guess-item-name'>{guessItem.guess}</div>
              )}
            </div>
          ))
          }
        </div>
      </div>

      {/* Overlay and Answer Box */}
      {gameCompleted && (
        <>
          <div className='modal-overlay'>
            {characterOfTheDay && (
              <div className='answer-box'>
                <div className='answer'>
                  <h3 className="congratulations">Congratulations!</h3>
                  <div className='answer-item'>
                    {gameWon && youtubeLink ? (
                      <div className='answer-struct'>
                        <div className='answer-image-text'>
                          <img
                            src={`${process.env.PUBLIC_URL}/img/characters-square/${characterOfTheDay.image}`}
                            alt={characterOfTheDay.name}
                            style={{ width: '100px', height: '100px', marginRight: '32px' }}
                            className="answer-item-image"
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            ref={imageRef}
                          />
                          <div className='answer-text'>
                            You found <br /> <strong>{characterOfTheDay.name}</strong>
                          </div>
                        </div>
                        <div className='button-box'>
                          <Link to="/main"><HoverButton title='main'></HoverButton></Link>
                          <Link to="/main-game"><HoverButton title='Next Game'></HoverButton></Link>
                        </div>
                      </div>
                    ) : (
                      <span className='guess-item-name'>Character data not available</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlindTest;
