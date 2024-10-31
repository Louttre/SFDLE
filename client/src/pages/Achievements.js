import React, { useEffect, useState } from 'react';
import { useAchievementStore } from '../store/achievementStore';
import './Achievements.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const AchievementsPage = () => {
  const { achievements, fetchUserAchievements, isLoading, error } = useAchievementStore();
  const [flippedAchievements, setFlippedAchievements] = useState({});
  const [cardAngles, setCardAngles] = useState({});
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

  // Handle mouse movement over a card
  const handleMouseMove = (e, achievementName) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cardWidth = rect.width;
    const cardHeight = rect.height;
    const centerX = rect.left + cardWidth / 2;
    const centerY = rect.top + cardHeight / 2;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const rotateX = ((mouseY - centerY) / (cardHeight / 2)) * -20; // Max tilt of 10 degrees
    const rotateY = ((mouseX - centerX) / (cardWidth / 2)) * 20;

    setCardAngles((prevAngles) => ({
      ...prevAngles,
      [achievementName]: { rotateX, rotateY },
    }));
  };

  // Reset the card tilt when the mouse leaves
  const handleMouseLeave = (achievementName) => {
    setCardAngles((prevAngles) => ({
      ...prevAngles,
      [achievementName]: { rotateX: 0, rotateY: 0 },
    }));
  };

  if (isLoading) return <p>Loading achievements...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="achievement-page">
      {/* Back to Main Button */}
      <button className="back-button-style" onClick={handleBackToMain}>
        Back to Main
      </button>

      <h2 className='your-achievements'>Your Achievements</h2>
      <div className="achievement-list">
        {achievements.map((achievement) => {
          const isCompleted = achievement.progress >= achievement.condition;
          const isFlipped = flippedAchievements[achievement.name] || false;
          const angles = cardAngles[achievement.name] || { rotateX: 0, rotateY: 0 };

          return (
            <div
              key={achievement.name}
              className={`achievement-item ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleFlip(achievement.name)}
              onMouseMove={(e) => handleMouseMove(e, achievement.name)}
              onMouseLeave={() => handleMouseLeave(achievement.name)}
              style={{
                '--rotateX': `${angles.rotateX}deg`,
                '--rotateY': `${angles.rotateY}deg`,
              }}
            >
              <div className={`achievement-card ${isCompleted ? 'completed' : ''}`}>
                <div className="achievement-front">
                  <h3 className="achievement-name">{achievement.name}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                  <div className="progress-bar">
                    <div
                      className={`progress ${isCompleted ? 'completed' : ''}`}
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
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsPage;
