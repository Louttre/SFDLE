import express from 'express';
import { getCharacter, getAllChars, getCharOfTheDay, compareChar, getListChars } from '../controllers/char.controller.js';

const router = express.Router();

router.get('/', getAllChars);
router.get('/list-char', getListChars);
router.get('/char-of-the-day', getCharOfTheDay);
router.post('/compare', compareChar);
router.post('/characteristics', getCharacter)
export default router;