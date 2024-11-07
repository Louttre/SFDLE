import express from 'express';
import { getAchievements, getUserAchievements, unlockAchievement, modifyUserAchievement, getLeaderboard } from '../controllers/achiev.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
const router = express.Router();

router.get('/getachievements', getAchievements);
router.get('/getuserachievements', verifyToken, getUserAchievements);
router.get('/leaderboard', getLeaderboard);
router.post('/unlockachievement', unlockAchievement);
router.post('/modifyachievement', verifyToken, modifyUserAchievement);


export default router;