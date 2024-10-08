import express from 'express';
import { getCharacter, getBlind, compareEmoji, getEmoji, getAllChars, getCharOfTheDay, compareChar, getListChars, getEmojiOfTheDay, getBlindOfTheDay, compareBlind } from '../controllers/char.controller.js';

const router = express.Router();

router.get('/', getAllChars);
router.get('/list-char', getListChars);
router.get('/char-of-the-day', getCharOfTheDay);
router.get('/emo-of-the-day', getEmojiOfTheDay);
router.get('/emo', getEmoji);
router.post('/emo-compare', compareEmoji);
router.post('/compare', compareChar);
router.post('/characteristics', getCharacter)
router.get('/blind-of-the-day', getBlindOfTheDay);
router.get('/blind', getBlind);
router.post('/blind-compare', compareBlind);
export default router;