import React from 'react';
import './CongratulationsModal.css'; // Create this CSS file for styling
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function CongratulationsModal() {
    return (
        <div className="modal-overlay">
            <div className="congratulations-modal">
                <h2>Congratulations!</h2>
                <p>You have completed all the games. Come back tomorrow!</p>
                <p>You can still check your</p>
                <div className='achievement-box'>
                    <img
                        className='trophy'
                        src={`${process.env.PUBLIC_URL}/img/icon/trophy.svg`}
                        alt="Trophy"
                    />
                    <Link to="/achievements" className="link-achievement">
                        Achievements
                    </Link>
                </div>
                <p>or</p>
                <p>Check out the leaderboard</p>
                <div className="leaderboard-box">
                    <img
                        className='leaderboard-icon'
                        src={`${process.env.PUBLIC_URL}/img/medals/gold-medal.png`}
                        alt="Medal"
                    />
                    <Link to="/leaderboard" className="link-leaderboard">
                        Leaderboard
                    </Link>
                </div>    
            </div>
        </div>
    );
}

export default CongratulationsModal;