import React, { useState, useEffect, useRef } from 'react';
import useEmojiStore from '../store/emojiStore';
import Cookies from 'js-cookie';
import './Emoji.css';
import Input from '../components/input';
import { VenetianMask } from 'lucide-react';
import useGameStore from '../store/gameStore';
import { Link } from 'react-router-dom';
import HoverButton from '../components/HoverButton';

const EmojiGame = () => {
  // Destructure state and actions from the emoji store
  const {
    input,
    setInput,
    suggestions,
    getCharacter,
    getEmoji,
    emoji,
    compareGuess,
    clearinput,
    characterOfTheDay,
    getCharacterOfTheDay,
  } = useEmojiStore();

  // Import the setGameCompleted action from the game store
  const { setGamesCompleted } = useGameStore();

  // Local state variables
  const [revealedEmojis, setRevealedEmojis] = useState([]);
  const [wrongGuessCount, setWrongGuessCount] = useState(0);
  const [guessHistory, setGuessHistory] = useState([]);
  const [gameCompleted, setLocalGameCompleted] = useState(false); // Renamed to avoid confusion with global state
  const [isLoading, setIsLoading] = useState(true);

  // Reference to the image element for tilt effect
  const imageRef = useRef(null);

  // Fetch emoji and character of the day on component mount
  useEffect(() => {
    const fetchCharacter = async () => {
      await getEmoji();
      await getCharacterOfTheDay();
      setIsLoading(false);
    };
    fetchCharacter();
  }, [getEmoji, getCharacterOfTheDay]);

  useEffect(() => {
    const savedGuessHistory = Cookies.get('guessHistory_emojiGame');
    if (savedGuessHistory) {
      setGuessHistory(JSON.parse(savedGuessHistory));
    }

    const completed = Cookies.get('gameCompleted_emojiGame') === 'true';
    setLocalGameCompleted(completed); // Update global state
  }, [setLocalGameCompleted]);

  // Update revealed emojis based on game state
  useEffect(() => {
    if (emoji) {
      if (gameCompleted) {
        // If the game is completed, reveal all emojis
        setRevealedEmojis(emoji.emoji);
      } else {
        // If not, reveal the first emoji and hide the others
        setRevealedEmojis([emoji.emoji[0], '❓', '❓']);
      }
    }
  }, [emoji, gameCompleted]);

  // Save guess history to cookies whenever it changes
  useEffect(() => {
    Cookies.set('guessHistory_emojiGame', JSON.stringify(guessHistory), {
      expires: getTimeUntilNextMinute(),
    });
  }, [guessHistory]);

  // Helper function to calculate time until midnight for cookie expiration
  function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0); // Set to midnight
    const millisecondsUntilMidnight = midnight.getTime() - now.getTime();
    return millisecondsUntilMidnight / (1000 * 60 * 60 * 24); // Convert to fraction of a day
  }

  function getTimeUntilNextMinute() {
    const now = new Date();
    const nextMinute = new Date(now.getTime() + 60000);
    nextMinute.setSeconds(0, 0); // Set to the start of the next minute
    const millisecondsUntilReset = nextMinute.getTime() - now.getTime();
    return millisecondsUntilReset / (1000 * 60 * 60 * 24); // Convert to fraction of a day
  }
  
  // Handle user's guess
  const handleGuess = async (guess) => {
    if (gameCompleted) {
      // Do nothing if the game is completed
      return;
    }

    const isCorrect = await compareGuess(guess);
    const fetchedCharacter = await getCharacter(guess);

    // Update guess history if a valid character was returned
    if (fetchedCharacter) {
      setGuessHistory((prevHistory) => [
        ...prevHistory,
        { guess, isCorrect, character: fetchedCharacter },
      ]);
    }

    if (isCorrect) {
      setLocalGameCompleted(true); // Update local state
      setRevealedEmojis(emoji.emoji);
      Cookies.set('gameCompleted_emojiGame', 'true', {
        expires: getTimeUntilNextMinute(),
      });
      setGamesCompleted('emojiGame'); // Update global state
    } else {
      // Reveal next emoji if any
      if (wrongGuessCount < 2) {
        const updatedEmojis = [...revealedEmojis];
        updatedEmojis[wrongGuessCount + 1] = emoji.emoji[wrongGuessCount + 1];
        setRevealedEmojis(updatedEmojis);
        setWrongGuessCount((prev) => prev + 1);
      }
    }

    clearinput();
  };

  // Handle mouse movement over the image for tilt effect
  const handleMouseMove = (e) => {
    const image = imageRef.current;
    const rect = image.getBoundingClientRect();

    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = x - centerX;
    const deltaY = y - centerY;

    const percentX = deltaX / centerX; // -1 to 1
    const percentY = deltaY / centerY; // -1 to 1

    const maxTilt = 15; // degrees

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

  // Display loading indicator while fetching data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the suggestion list with images and names
  const listSuggestion = (suggestions) => {
    return Array.isArray(suggestions) && suggestions.length > 0 ? (
      suggestions.map((suggestion, index) => (
        <li
          key={index}
          onClick={() => handleGuess(suggestion.name)}
          className="suggestion-item"
        >
          <img
            src={`${process.env.PUBLIC_URL}/img/characters-square/${suggestion.image}`}
            alt={suggestion.name}
            className="suggestion-image"
          />
          {suggestion.name}
        </li>
      ))
    ) : (
      <div></div> // Handle the case of no suggestions
    );
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <div className="emoji-box">
        <div className="emoji-game-title">Guess the Character</div>

        {/* Display the emoji squares */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {revealedEmojis.map((emojiChar, index) => (
            <div
              key={index}
              style={{
                fontSize: '50px',
                margin: '10px',
                paddingBottom: '0.4rem',
                border: '4px solid #f38888',
                width: '7rem',
                height: '7rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1e293b',
              }}
            >
              {emojiChar}
            </div>
          ))}
        </div>

        {/* Input and suggestions */}
        {!gameCompleted && (
          <div>
            <div className="input">
              <Input
                icon={VenetianMask}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your guess..."
              />
            </div>
            <ul className="listSuggestions">{listSuggestion(suggestions)}</ul>
          </div>
        )}
      </div>

      {/* Display Guess History */}
      <div className="guess-history">
        <div className="guesses">
          {guessHistory.map((guessItem, index) => (
            <div
              key={index}
              className={`guess-item ${
                guessItem.isCorrect ? 'correct' : 'incorrect'
              }`}
            >
              {guessItem.character ? (
                <>
                  <img
                    className="guess-item-image"
                    src={`${process.env.PUBLIC_URL}/img/characters-square/${guessItem.character.image}`}
                    alt={guessItem.character.name}
                    draggable="false"
                  />
                  <div className="guess-item-name">
                    {guessItem.character.name}
                  </div>
                </>
              ) : (
                <span className="guess-item-name">
                  Character data not available
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Message if game is completed */}
      {gameCompleted && characterOfTheDay && (
        <div className="modal-overlay">
          {/* Overlay to blur and darken background */}
          <div className="answer-box">
            <div className="answer">
              <h3 className="congratulations">Congratulations!</h3>
              <div className="answer-item">
                <div className="answer-struct">
                  <div className="answer-image-text">
                    <img
                      src={`${process.env.PUBLIC_URL}/img/characters-square/${characterOfTheDay.image}`}
                      alt={characterOfTheDay.name}
                      style={{ width: '100px', height: '100px', marginRight: '32px' }}
                      className="answer-item-image"
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      ref={imageRef}
                      draggable="false"
                    />
                    <div className="answer-text">
                      You found <br /> <strong>{characterOfTheDay.name}</strong>
                    </div>
                  </div>
                  <div className="button-box">
                    <Link to="/main">
                      <HoverButton title="Main" />
                    </Link>
                    <Link to="/blind-test">
                      <HoverButton title="Next Game" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiGame;
