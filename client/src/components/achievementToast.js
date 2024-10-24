import React from 'react';
import './achievementToast.css'; // Optional: For custom styling

const AchievementToast = ({ achievementName }) => {

  const handleClick = () => {
    window.location.href = '/achievements'; // Redirect to Achievements page
  };

  return (
    <div
      className="achievement-toast"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`Achievement Unlocked: ${achievementName}. Click to view your achievements.`}
      tabIndex={0} // Make it focusable}
    >
      <strong>Achievement Unlocked!</strong>
      <p>{achievementName}</p>
      <small>Click here to view your achievements.</small>
    </div>
  );
};

export default AchievementToast;