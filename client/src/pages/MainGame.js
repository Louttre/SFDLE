import React, { useState, useEffect, useRef } from 'react';
import CharacterSquares from '../components/characterSquares'; // Import CharacterSquares component
import useCharacterStore from '../store/gameStore'; // Import Zustand store
import './MainGame.css'; // Import styles
import Cookies from 'js-cookie'; // Import Cookies for saving guess history
import { Link } from 'react-router-dom'; // Import Link for navigation
import HoverButton from '../components/HoverButton'; // Import HoverButton component

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
        selectCharacterAndFetchData,
        clearInput,
        input,
        setInput,
        characterCharacteristics,
        comparisonResults,
        characterOfTheDay,
        getCharacterOfTheDay,
        gameCompleted,
        setGamesCompleted,
    } = useCharacterStore();

    const [guessHistory, setGuessHistory] = useState([]); // Store previous guesses
    const [debouncedInput, setDebouncedInput] = useState(input); // Debounced input value
    const [isLoadingFromCookies, setIsLoadingFromCookies] = useState(true); // Track if loading from cookies
    const [showAnswerBox, setShowAnswerBox] = useState(false); // Flag to show the answer box
    const imageRef = useRef(null);

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

        const maxTilt = 20; // degrees

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
    // Load guess history from cookies on component mount
    useEffect(() => {
        const savedHistory = Cookies.get('guessHistory_mainGame');
        if (savedHistory) {
            setGuessHistory(JSON.parse(savedHistory));
        }
        const savedGameState = Cookies.get('gameState_mainGame');
        if (savedGameState) {
            const { gameCompleted, characterOfTheDay } = JSON.parse(savedGameState);
            // Update Zustand store with the saved game state
            useCharacterStore.setState({ gameCompleted, characterOfTheDay });
        }
        setIsLoadingFromCookies(false); // Indicate that loading from cookies is complete
    }, []);
    // Handle the input value update with debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedInput(input); // Update the debounced input after user stops typing
        }, 500); // 500ms debounce delay

        return () => {
            clearTimeout(handler); // Cleanup previous timeout if the user continues typing
        };
    }, [input]);

    // Fetch suggestions based on the debounced input
    useEffect(() => {
        if (debouncedInput) {
            setInput(debouncedInput); // Trigger the API request in the Zustand store
        }
    }, [debouncedInput, setInput]);

    const handleSuggestion = (e) => {
        setInput(e.target.value); // Update the input state
    };

    const handleGuess = (suggestionName) => {
        selectCharacterAndFetchData(suggestionName); // Pass the character name to the API
        clearInput(); // Clear the input field after selecting a suggestion
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
    // Save guess history to cookies when it changes
    useEffect(() => {
        if (guessHistory.length > 0) {
            const cookieExpiry = getTimeUntilNextMinute(); // Get expiry time (midnight or next reset)
            Cookies.set('guessHistory_mainGame', JSON.stringify(guessHistory), { expires: cookieExpiry });
        }
    }, [guessHistory]);

    function getTimeUntilNextMinute() {
        const now = new Date();
        const nextMinute = new Date(now.getTime() + 60000);
        nextMinute.setSeconds(0, 0); // Set to the start of the next minute
        const millisecondsUntilReset = nextMinute.getTime() - now.getTime();
        return millisecondsUntilReset / (1000 * 60 * 60 * 24); // Convert to fraction of a day
    }

    useEffect(() => {
        if (characterCharacteristics && comparisonResults) {
            const newGuess = { characterCharacteristics, comparisonResults };
            setGuessHistory((prevHistory) => [...prevHistory, newGuess]);
        }
    }, [characterCharacteristics, comparisonResults]);

    // Monitor gameCompleted and trigger modal display after animations
    useEffect(() => {
        if (gameCompleted) {
            getCharacterOfTheDay(); // Fetch the character of the day
            setGamesCompleted('mainGame'); // Mark mainGame as completed
            const animationDuration = Cookies.get('gameWon_mainGame') ? 0 : 3000; // Adjust this value based on your actual animation duration
            Cookies.set('gameWon_mainGame', true, { expires: getTimeUntilNextMinute() });
            const timer = setTimeout(() => {
                setShowAnswerBox(true);
            }, animationDuration);
            return () => clearTimeout(timer);
        } else {
            setShowAnswerBox(false);
        }
    }, [gameCompleted, setGamesCompleted]);

    return (
        <div className="game-container">
            <div className="GameBox">
                <div className='game-title'>Guess today's fighting game character</div>
                <input
                    type="text"
                    placeholder="Enter a name..."
                    value={input} // Bind the input value to Zustand state
                    onChange={handleSuggestion} // Update state on change
                    className="input-field"
                />
                <ul className="listSuggestions">
                    {listSuggestion(suggestions)}
                </ul>
                <div className="rules-container">
                    <span className="rules-text">Rules</span>
                    <div className="rules-popup">
                        <div className="rules-squares">
                            <div className="rules-square correct"></div>
                            <div className="rules-square partial"></div>
                            <div className="rules-square incorrect"></div>
                        </div>
                        <div className="rules-labels">
                            <div>Correct</div>
                            <div>Partial</div>
                            <div>Incorrect</div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Conditionally render Key Squares based on guessHistory */}
            {guessHistory.length > 0 && (
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
            )}

            <div className="guesses-container">
                <div className="guesses">
                    {guessHistory.map((guess, index) => (
                        <CharacterSquares
                            key={index}
                            characterData={guess.characterCharacteristics}
                            comparisonResults={guess.comparisonResults}
                            className={!isLoadingFromCookies ? "animate__animated animate__flipInY" : ''}
                        />
                    ))}
                </div>
            </div>
            {/* Message if game is completed */}
            {showAnswerBox && characterOfTheDay && (
                <>
                    <div className='modal-overlay'> {/* Overlay to darken background */}
                        <div className='answer-box'>
                            <div className='answer'>
                                <h3 className="congratulations">Congratulations!</h3>
                                <div className='answer-item'>
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
                                            <Link to="/willitkill"><HoverButton title='Next Game'></HoverButton></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default MainGame;
