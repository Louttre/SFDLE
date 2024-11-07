// src/pages/Leaderboard.js

import React, { useEffect } from 'react';
import useLeaderboardStore from '../store/LeaderboardStore';
import './Leaderboard.css';

function Leaderboard() {
  const {
    leaderboardData,
    totalAchievements,
    loading,
    error,
    fetchLeaderboard,
  } = useLeaderboardStore();

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  if (error) {
    return <div className="leaderboard-error">Error loading leaderboard: {error}</div>;
  }

  // Separate the top three users and the rest
  const topThreeUsers = leaderboardData.slice(0, 3);
  const otherUsers = leaderboardData.slice(3);

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-top-three">
        {topThreeUsers.map((user, index) => {
          const rank = index + 1;
          return (
            <div
              className={`leaderboard-card animated-card rank-${rank}`}
              key={user.userId || index}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {getRankBadge(rank)}
              <div className="leaderboard-info">
                <h2 className="leaderboard-username">{user.username}</h2>
                <div className="leaderboard-progress">
                  <div className="progress-bar-container">
                    <div
                      className="progress-bar-leaderboard"
                      style={{
                        '--progress-width': `${(user.achievementCount / totalAchievements) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {user.achievementCount} / {totalAchievements} Achievements
                  </span>
                </div>
              </div>
              <div className="leaderboard-points">
                <span>{user.totalPoints} Points</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="leaderboard-list">
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Progress</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {otherUsers.map((user, index) => {
              const rank = index + 4; // Since index starts at 0 and we're after the top 3
              return (
                <tr key={user.userId || index}>
                  <td>#{rank}</td>
                  <td>{user.username}</td>
                  <td>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-leaderboard"
                        style={{
                          '--progress-width': `${(user.achievementCount / totalAchievements) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {user.achievementCount} / {totalAchievements}
                    </span>
                  </td>
                  <td>{user.totalPoints} Points</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getRankBadge(rank) {
  let medalImage = null;
  let rankClass = 'leaderboard-rank';

  if (rank === 1) {
    medalImage = <img src="/img/medals/gold-medal.png" alt="Gold Medal" />;
  } else if (rank === 2) {
    medalImage = <img src="/img/medals/silver-medal.png" alt="Silver Medal" />;
  } else if (rank === 3) {
    medalImage = <img src="/img/medals/bronze-medal.png" alt="Bronze Medal" />;
  }

  return (
    <div className={rankClass}>
      {medalImage}
      <div className="rank-number">#{rank}</div>
    </div>
  );
}

export default Leaderboard;
