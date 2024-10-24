import React, { useEffect, useState } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import './Achievements.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const AchievementsPage = () => {
  const { achievements, fetchUserAchievements, isLoading, error } = useAchievementStore();
  const [flippedAchievements, setFlippedAchievements] = useState({});
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchUserAchievements();
  }, [fetchUserAchievements]);

  const handleFlip = (achievementName) => {
    setFlippedAchievements((prevState) => ({
      ...prevState,
      [achievementName]: !prevState[achievementName],
    }));
  };

  const handleBackToMain = () => {
    navigate('/main'); // Navigate to main
  };

  if (isLoading) return <p>Loading achievements...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="achievement-page">
      {/* Back to Main Button */}
      <button className="back-button-style" onClick={handleBackToMain}>
        Back to Main
      </button>

      <h2>Your Achievements</h2>
      <div className="achievement-list">
        {achievements.map((achievement) => (
          <div
            key={achievement.name}
            className={`achievement-item ${flippedAchievements[achievement.name] ? 'flipped' : ''}`}
            onClick={() => handleFlip(achievement.name)}
          >
            <div className="achievement-card">
              <div className="achievement-front">
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">{achievement.description}</p>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${(achievement.progress / achievement.condition) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="progress-text">
                  {achievement.progress} / {achievement.condition}
                </p>
              </div>
              <div className="achievement-back">
                {/* Backside content */}
                <h3 className="achievement-name">{achievement.name}</h3>
                <p className="achievement-description">Additional information about this achievement.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
