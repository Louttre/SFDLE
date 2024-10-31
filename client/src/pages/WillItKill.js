// src/components/WillItKill.js

import React, { useEffect, useRef, useState } from 'react';
import useWillItKillStore from '../store/willitkillStore';
import './WillItKill.css';
import Cookies from 'js-cookie';
import useCharacterStore from '../store/gameStore';
import { Link } from 'react-router-dom';
import HoverButton from '../components/HoverButton';

const WillItKill = () => {
    const {
        video_id,
        getVideo,
        userAnswer,
        answer,
        killornot,
        killOrNot,
    } = useWillItKillStore();

    const { setGamesCompleted } = useCharacterStore();

    const playerRef = useRef(null); // Reference to the YouTube player
    const [isPaused, setIsPaused] = useState(false); // Track if the video is paused
    const [isChoiceMade, setIsChoiceMade] = useState(false); // Track if the user made a choice
    const [videoFinished, setVideoFinished] = useState(false); // Track if the video finished
    const hasPaused = useRef(false); // Use ref for hasPaused
    const hasStartedPlaying = useRef(false); // Use ref for hasStartedPlaying
    const [timeCheckerInterval, setTimeCheckerInterval] = useState(null); // Interval ID for checking time
    const [isGameLoadedFromCookies, setIsGameLoadedFromCookies] = useState(false); // Track if game was loaded from cookies

    useEffect(() => {
        // Fetch the video once when the component mounts
        getVideo();
    }, []); // Empty dependency array ensures the effect runs only once on mount

    function getTimeUntilNextMinute() {
        const now = new Date();
        const nextMinute = new Date(now.getTime() + 60000);
        nextMinute.setSeconds(0, 0); // Set to the start of the next minute
        const millisecondsUntilReset = nextMinute.getTime() - now.getTime();
        return millisecondsUntilReset / (1000 * 60 * 60 * 24); // Convert to fraction of a day
    }

    // Function to load the YouTube API
    const loadYouTubeAPI = () => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initializePlayer;
        } else {
            initializePlayer();
        }
    };

    // Initialize the YouTube Player with the selected video
    const initializePlayer = () => {
        if (video_id && window.YT) {
            playerRef.current = new window.YT.Player('youtube-player', {
                videoId: video_id,
                playerVars: {
                    controls: 0, // Hide controls
                    disablekb: 1, // Disable keyboard interaction
                    modestbranding: 1, // Remove YouTube branding
                    rel: 0, // Prevent showing related videos
                    pointerEvents: 'none', // Disable pointer events
                },
                events: {
                    onReady: onPlayerReady,
                    onStateChange: onPlayerStateChange,
                },
            });
        }
    };

    // Handle player ready state
    const onPlayerReady = (event) => {
        // Player is ready, no need to start the timer here
    };

    // Handle player state changes
    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING && !hasStartedPlaying.current) {
            // Video starts playing for the first time
            hasStartedPlaying.current = true;

            // Start checking the playback time
            const intervalId = setInterval(() => {
                if (playerRef.current && !hasPaused.current) {
                    const currentTime = playerRef.current.getCurrentTime();
                    if (currentTime >= 6) {
                        playerRef.current.pauseVideo(); // Pause the video
                        setIsPaused(true); // Update paused state
                        hasPaused.current = true; // Set the flag to indicate the video has been paused

                        // Clear the interval
                        clearInterval(intervalId);
                        setTimeCheckerInterval(null);
                    }
                }
            }, 500); // Check every 500ms

            setTimeCheckerInterval(intervalId);
        }

        // Handle when the video ends
        if (event.data === window.YT.PlayerState.ENDED) {
            setVideoFinished(true); // Video ended, show answer
        }
    };

    // Clean up the interval when the component unmounts
    useEffect(() => {
        return () => {
            if (timeCheckerInterval) {
                clearInterval(timeCheckerInterval);
            }
        };
    }, [timeCheckerInterval]);

    useEffect(() => {
        if ((isGameLoadedFromCookies || videoFinished) && isChoiceMade) {
            // Game is completed
            setGamesCompleted('willItKill'); // Mark willItKill as completed
        }
    }, [isGameLoadedFromCookies, videoFinished, isChoiceMade, setGamesCompleted]);

    // Handle user choice
    const handleChoice = async (choice) => {
        setIsChoiceMade(true); // User made a choice
        const answerData = await userAnswer(choice); // Send choice to the backend and get the correct answer
        const killOrNotData = await killOrNot(); // Get the kill or not result
        // Convert the returned data to booleans
        const answerBoolean = answerData === true || answerData === 'true';
        const killornotBoolean = killOrNotData === true || killOrNotData === 'true';
        // Save game state to cookies
        const gameState = {
            answer: answerBoolean, // The correct answer from the backend
            useranswer: choice, // The user's choice
            killornot: killornotBoolean, // The kill or not result from the backend
        };
        const expires = getTimeUntilNextMinute();
        Cookies.set('gameState_willitkill', JSON.stringify(gameState), { expires });
        // Resume the video
        if (playerRef.current) {
            playerRef.current.playVideo(); // Resume video playback
        }
    };

    // Load game state from cookies on mount
    useEffect(() => {
        const savedGameState = Cookies.get('gameState_willitkill');
        if (savedGameState) {
            const { answer, useranswer, killornot } = JSON.parse(savedGameState);
            // Convert answer and killornot to booleans
            const answerBoolean = answer === true || answer === 'true';
            const killornotBoolean = killornot === true || killornot === 'true';

            // Update Zustand store with the saved game state
            useWillItKillStore.setState({
                answer: answerBoolean,
                useranswer,
                killornot: killornotBoolean
            });

            setIsChoiceMade(true); // User has already made a choice
            setVideoFinished(true); // Video has already finished
            setIsGameLoadedFromCookies(true); // Indicate that the game was loaded from cookies
        }
    }, []);

    // Load YouTube API when video_id becomes available
    useEffect(() => {
        if (video_id) {
            loadYouTubeAPI();
        }
    }, [video_id]);

    // Function to display the answer box and overlay
    const showAnswer = () => {
        if (isGameLoadedFromCookies || videoFinished) { // Display answer if game loaded from cookies or video finished
            return (
                <>
                    <div className='modal-overlay'> {/* Overlay to blur and darken background */}
                        <div className='answer-box'>
                            <div className='answer-struct'>

                                <h3 style={{ fontWeight: 'bold' }}>
                                    {answer ? 'Congratulations!' : 'Better luck next time!'}
                                </h3>

                                <div className='answer-text'>
                                    {killornot ? 'It was a kill.' : 'It did not kill.'}

                                </div>
                                <div className='button-box'>
                                    <Link to="/main"><HoverButton title='main'></HoverButton></Link>
                                    <Link to="/emoji"><HoverButton title='Next Game'></HoverButton></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        }
        return null;
    };

    return (
        <div className='video-container' style={{ textAlign: 'center', padding: '24px' }}>
            {video_id && (
                <div style={{ position: 'relative', display: 'inline-block' }}>

                    <div id="youtube-player" style={{ zIndex: 1 }}></div> {/* YouTube iframe will be rendered here */}

                    {/* Overlay to block user interaction after the video starts */}
                    {hasStartedPlaying.current && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 2, // Bring this overlay above the iframe
                                pointerEvents: 'auto', // Block interaction
                                backgroundColor: 'rgba(0, 0, 0, 0.1)', // Transparent overlay
                            }}
                        ></div>
                    )}

                    {/* Semi-transparent overlay when video is paused and choice not made */}
                    {isPaused && !isChoiceMade && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent black overlay
                                zIndex: 3, // Bring this overlay above everything
                                pointerEvents: 'auto', // Block interaction
                            }}
                        ></div>
                    )}
                </div>
            )}
            {!isPaused && !isChoiceMade && (
                <div className='rules'>Look closely and choose if the combo will or will not kill the opponent</div>
            )}
            {/* Show choice buttons when the video is paused and no choice is made */}
            {isPaused && !isChoiceMade && (
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '18px',
                    justifyContent: 'space-between'
                }}>
                    <button className='choice-button' onClick={() => handleChoice(true)}>Yes, it kills</button>
                    <button className='choice-button' onClick={() => handleChoice(false)}>No, it doesn't</button>
                </div>
            )}

            {/* Show the answer after the video ends or when loading from cookies */}
            {showAnswer()}
        </div>
    );
};

export default WillItKill;
