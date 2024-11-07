// CompletionChecker.js

import React, { useEffect, useState } from 'react';
import useGameStore from '../store/gameStore';
import CongratulationsModal from './CongratulationsModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAchievementStore } from '../store/achievementStore';

function CompletionChecker() {
  const { gamesCompleted, loadGamesCompleted } = useGameStore();
  const [allGamesCompleted, setAllGamesCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { modifyAchievementProgress } = useAchievementStore();

  useEffect(() => {
    loadGamesCompleted(); // Load completion status from cookies on mount
  }, [loadGamesCompleted]);

  useEffect(() => {
    const allCompleted = Object.values(gamesCompleted).every((completed) => completed);
    setAllGamesCompleted(allCompleted);
  }, [gamesCompleted]);

  // Redirect to /main when all games are completed and not already on /main
  useEffect(() => {
    if (allGamesCompleted && location.pathname !== '/main') {
      modifyAchievementProgress('The journey begins')
      modifyAchievementProgress('Two in a row')
      navigate('/main');
    }
  }, [allGamesCompleted, navigate, location.pathname]);

  // Do not display the modal on the achievements page or if not on /main
  if (location.pathname !== '/main') {
    return null;
  }

  return (
    <>
      {allGamesCompleted && <CongratulationsModal />}
    </>
  );
}

export default CompletionChecker;