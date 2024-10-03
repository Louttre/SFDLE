import React, { useState } from 'react';
import CharacterSquares from '../components/characterSquares'; // Import CharacterSquares component
import useCharacterStore from '../store/gameStore'; // Import Zustand store
import './MainGame.css'; // Import styles

function MainGame() {
  const {
    input,
    suggestions,
    selectedCharacter, // The selected character's data
    characterCharacteristics, // Contains the selected character's characteristics
    comparisonResults, // Contains the comparison results
    setInput,
    selectCharacter, // Function to select a character
  } = useCharacterStore();

  const [guessHistory, setGuessHistory] = useState([]); // Store previous guesses

  const handleSuggestion = (e) => {
    setInput(e);
  };

  const handleGuess = (suggestion) => {
    selectCharacter(suggestion);

    // Ensure characterCharacteristics and comparisonResults are available before adding the guess
    if (characterCharacteristics && comparisonResults) {
      setGuessHistory((prevHistory) => [
        { characterCharacteristics, comparisonResults }, // Add the new guess at the top
        ...prevHistory,
      ]);
    }
  };

  const listSuggestion = (suggestions) => {
    return suggestions.map((suggestion, index) => (
      <li key={index} onClick={() => handleGuess(suggestion)} className="suggestion-item">
        {suggestion}
      </li>
    ));
  };

  return (
    <div className="game-container">
      <div className="GameBox">
        <input
          type="text"
          placeholder="Enter a name..."
          onChange={(e) => handleSuggestion(e.target.value)}
        />
        <ul className="listSuggestions">
          {listSuggestion(suggestions)}
        </ul>

        </div>
        
        {/* Render each guess in reverse order, with animation */}
        <div className="guesses-container">
          {guessHistory.map((guess, index) => (
            <CharacterSquares
              key={index}
              characterData={guess.characterCharacteristics}
              comparisonResults={guess.comparisonResults}
              className="animate__animated animate__flipInY" // Play animation for each guess
            />
          ))}
      </div>
    </div>
  );
}

export default MainGame;
