import React, { useState, useEffect } from 'react';
import CharacterSquares from '../components/characterSquares'; // Import CharacterSquares component
import useCharacterStore from '../store/gameStore'; // Import Zustand store
import './MainGame.css'; // Import styles

// Custom Key Component for personalized labels/icons/etc.
function CustomKey({ label, tooltip }) {
  return (
    <div className="key-square">
      <div className="key-content" data-tooltip={tooltip}>
        {<span className="fields">{label}</span>}
        <hr className="hr" />
      </div>
    </div>
  );
}

function MainGame() {
  const {
    input,
    suggestions,
    selectCharacterAndFetchData, // The selected character's data
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
    selectCharacterAndFetchData(suggestion);
  };

  const listSuggestion = (suggestions) => {
    return suggestions.map((suggestion, index) => (
      <li key={index} onClick={() => handleGuess(suggestion)} className="suggestion-item">
        {suggestion}
      </li>
    ));
  };

  useEffect(() => {
    // This effect will run every time the selected character or results change, ensuring a new guess is added.
    if (characterCharacteristics && comparisonResults) {
      const newGuess = { characterCharacteristics, comparisonResults };
      setGuessHistory((prevHistory) => [...prevHistory, newGuess]);
    }
  }, [characterCharacteristics, comparisonResults]); // Run when these change

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

      {/* Key Squares - Rendered only once with personalized content */}
      <div className="key-squares">
        <div className="square-container">
          {/* Render each key with custom labels or icons */}
          <CustomKey label="Character" tooltip="Character's image" />
          <CustomKey label="Height" tooltip="175cm etc." />
          <CustomKey label="Weight" tooltip="75kg etc." />
          <CustomKey label="Birthplace" tooltip="Japan, Russia etc." />
          <CustomKey label="Genre" tooltip="Male, Female, Unknown" />
          <CustomKey label="Eye color" tooltip="Red, Blue etc." />
          <CustomKey label="Fighting Style" tooltip="Ansatsuken, taekwendo etc." />
          <CustomKey label="First appearance" tooltip="First game appearance" />
        </div>
      </div>

      <div className="guesses-container">
        <div className="guesses">
          {guessHistory.map((guess, index) => (
            <CharacterSquares
              key={index}
              characterData={guess.characterCharacteristics}
              comparisonResults={guess.comparisonResults}
              className="animate__animated animate__flipInY"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainGame;
