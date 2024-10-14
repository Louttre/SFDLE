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
        suggestions,
        selectCharacterAndFetchData, // The selected character's data
        clearInput, // Clear input method
        input, // Get the current input state
        setInput, // Set input method
        characterCharacteristics, // Contains the selected character's characteristics
        comparisonResults, // Contains the comparison results
    } = useCharacterStore();

    const [guessHistory, setGuessHistory] = useState([]); // Store previous guesses

    const handleSuggestion = (e) => {
        setInput(e.target.value); // Update the input state
    };

    const handleGuess = (suggestion) => {
        selectCharacterAndFetchData(suggestion);
        clearInput(); // Clear the input field after selecting a suggestion
    };

    const listSuggestion = (suggestions) => {
        return suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleGuess(suggestion)} className="suggestion-item">
                {suggestion}
            </li>
        ));
    };

    useEffect(() => {
        if (characterCharacteristics && comparisonResults) {
            const newGuess = { characterCharacteristics, comparisonResults };
            setGuessHistory((prevHistory) => [ ...prevHistory, newGuess]);
        }
    }, [characterCharacteristics, comparisonResults]);

    return (
        <div className="game-container">
            <div className="GameBox">
                <input
                    type="text"
                    placeholder="Enter a name..."
                    value={input} // Bind the input value to Zustand state
                    onChange={handleSuggestion} // Update state on change
                />
                <ul className="listSuggestions">
                    {listSuggestion(suggestions)}
                </ul>
            </div>

            {/* Key Squares - Rendered only once with personalized content */}
            <div className="key-squares">
                <div className="square-container">
                    <CustomKey label="Character" tooltip="Character's image" />
                    <CustomKey label="Height" tooltip="175cm etc." />
                    <CustomKey label="Weight" tooltip="75kg etc." />
                    <CustomKey label="Birthplace" tooltip="Japan, Russia etc." />
                    <CustomKey label="Genre" tooltip="Male, Female, Unknown" />
                    <CustomKey label="Eye color" tooltip="Red, Blue etc." />
                    <CustomKey label="Fighting Style" tooltip="Ansatsuken, taekwondo etc." />
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
