import React, { useState, useEffect } from 'react';
import useEmojiStore from '../store/emojiStore';

const EmojiGame = () => {
    const {
        input,
        getCharacter,   // This is the function to fetch the "character of the day" with its emojis
        character,
        suggestions,      // Character data including name and emojis  // All characters for the suggestion dropdown
        comparedGuess,     // Function to compare the guess with the character of the day
        compareGuess,
        setInput, 
        clearinput,        // Function to update the input state
    } = useEmojiStore();

    const [revealedEmojis, setRevealedEmojis] = useState([]);
    const [wrongGuessCount, setWrongGuessCount] = useState(0);
    const [gameWon, setGameWon] = useState(false);


    useEffect(() => {
        getCharacter(); // Fetch the character of the day when component mounts
    }, []);

    useEffect(() => {
        if (character) {
            // Start with the first emoji revealed, others hidden as "?"
            setRevealedEmojis([character.emoji[0], "❓", "❓"]);
        }
    }, [character]);


    const handleSuggestion = (e) => {
        setInput(e.target.value); // Update the input state
    };

    const listSuggestion = (suggestions) => {
        return suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleGuess(suggestion)} className="suggestion-item">
                {suggestion}
            </li>
        ));
    };

    const handleGuess = async (guess) => {
        const isCorrect = await compareGuess(guess); // Compare the guess and wait for the result (true or false)

        if (isCorrect) { // If the guess is correct
            setGameWon(true); // Mark the game as won
            setRevealedEmojis(character.emoji); // Reveal all emojis
        } else {
            // Wrong guess, reveal the next emoji
            if (wrongGuessCount < 2) {
                const updatedEmojis = [...revealedEmojis];
                updatedEmojis[wrongGuessCount + 1] = character.emoji[wrongGuessCount + 1];
                setRevealedEmojis(updatedEmojis);
                setWrongGuessCount(prev => prev + 1);
            } else {
                // If all emojis are revealed and the guess is still wrong, do nothing
                // The game should continue until the correct guess
                setWrongGuessCount(3);
            }
        }

        clearinput(); // Clear the input field after a guess
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Guess the Character</h2>

            {/* Display the emoji squares */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                {revealedEmojis.map((emoji, index) => (
                    <div key={index} style={{
                        fontSize: '50px',
                        margin: '10px',
                        padding: '20px',
                        border: '2px solid black',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {emoji}
                    </div>
                ))}
            </div>

            {/* Input and suggestions */}
            {!gameWon && (
                <div>
                    <input
                        type="text"
                        value={input}
                        onChange={handleSuggestion}
                        placeholder="Type your guess..."
                        style={{ padding: '10px', width: '200px' }}
                    />
                    <ul className="listSuggestions">
                        {listSuggestion(suggestions)}
                    </ul>
                </div>
            )}

            {/* Message if game is won */}
            {gameWon && <h3>Congratulations! You guessed the character {character.name}</h3>}
        </div>
    );
};

export default EmojiGame;
