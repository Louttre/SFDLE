import React, { useEffect, useRef, useState } from 'react';
import useWillItKillStore from '../store/willitkillStore';
import './WillItKill.css';

const WillItKill = () => {
    const {
        video_id,
        getVideo,
        userAnswer,
        answer,
        killornot,
        killOrNot,
    } = useWillItKillStore();

    const playerRef = useRef(null); // Reference to the YouTube player
    const [isPaused, setIsPaused] = useState(false); // Track if the video is paused
    const [isChoiceMade, setIsChoiceMade] = useState(false); // Track if the user made a choice
    const [videoFinished, setVideoFinished] = useState(false); // Track if the video finished
    const hasPaused = useRef(false); // Use ref for hasPaused
    const hasStartedPlaying = useRef(false); // Use ref for hasStartedPlaying
    const [timeCheckerInterval, setTimeCheckerInterval] = useState(null); // Interval ID for checking time

    useEffect(() => {
        // Fetch the video once when the component mounts
        getVideo();
    }, []); // Empty dependency array ensures the effect runs only once on mount

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

    // Handle user choice
    const handleChoice = (choice) => {
        setIsChoiceMade(true); // User made a choice
        userAnswer(choice); // Send choice to the backend
        killOrNot();

        // Resume the video
        if (playerRef.current) {
            playerRef.current.playVideo(); // Resume video playback
        }
    };

    // Show the answer after the video ends
    const showAnswer = () => {
        if (videoFinished) {
            return (
                <div>
                    <h3>{answer ? 'Congrats' : 'Wrong answer'}</h3>
                    <h3>{killornot ? 'It was a kill' : 'It didn\'t kill'}</h3>
                </div>
            );
        }
    };

    // Load YouTube API when video_id becomes available
    useEffect(() => {
        if (video_id) {
            loadYouTubeAPI();
        }
    }, [video_id]);

    return (
        <div className='video-container' style={{ textAlign: 'center', padding: '24px'}}>
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
                    marginTop: '20px', display: 'flex', flexDirection: 'row', gap:'18px', justifyContent: 'space-between'}}>
            <button className='choice-button' onClick={() => handleChoice(true)}>Yes, it kills</button>
            <button className='choice-button' onClick={() => handleChoice(false)}>No, it doesn't</button>
        </div>
    )
}

{/* Show the answer after the video ends */ }
{ showAnswer() }
        </div >
    );
};

export default WillItKill;
