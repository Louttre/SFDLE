import React, { useEffect, useRef, useState } from 'react';
import useWillItKillStore from '../store/willitkillStore';

const YouTubeVideo = () => {
    const {
        video_id,
        getVideo,
        useranswer,
        answer,
        killornot,
    } = useWillItKillStore();

    const playerRef = useRef(null); // Reference to the YouTube player
    const [isPaused, setIsPaused] = useState(false); // Track if the video is paused
    const [isChoiceMade, setIsChoiceMade] = useState(false); // Track if the user made a choice
    const [videoFinished, setVideoFinished] = useState(false); // Track if the video finished
    const [hasPaused, setHasPaused] = useState(false); // Track if the video has already been paused

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
        // Start a timeout to pause the video after 6 seconds
        setTimeout(() => {
            if (playerRef.current && !hasPaused) {
                playerRef.current.pauseVideo(); // Pause the video
                setIsPaused(true); // Update paused state
                setHasPaused(true); // Set the flag to indicate the video has been paused
            }
        }, 6000); // 6-second delay after play starts
    };

    // Handle player state changes (e.g., when user starts playing)
    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.ENDED) {
            setVideoFinished(true); // Video ended, show answer
        }
    };

    // Handle user choice
    const handleChoice = (choice) => {
        setIsChoiceMade(true); // User made a choice
        useranswer(choice); // Send choice to the backend
        killornot();

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
        <div style={{ textAlign: 'center', padding: '20px' }}>
            {video_id && (
                <div style={{ marginTop: '20px', position: 'relative', display: 'inline-block' }}>
                    <div id="youtube-player"></div> {/* YouTube iframe will be rendered here */}

                    {/* Overlay to block interaction after the video is paused */}
                    {isPaused && !isChoiceMade && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
                                zIndex: 1, // Bring the overlay above the iframe
                            }}
                        ></div>
                    )}
                </div>
            )}

            {/* Show choice buttons when the video is paused and no choice is made */}
            {isPaused && !isChoiceMade && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={() => handleChoice(true)}>Yes, it kills</button>
                    <button onClick={() => handleChoice(false)}>No, it doesn't</button>
                </div>
            )}

            {/* Show the answer after the video ends */}
            {showAnswer()}
        </div>
    );
};

export default YouTubeVideo;
