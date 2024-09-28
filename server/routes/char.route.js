import express from 'express';
import { getAllChars, getCharOfTheDay, compareChar } from '../controllers/char.controller.js';

const router = express.Router();

router.get('/', getAllChars);
router.get('/char-of-the-day', getCharOfTheDay);
router.post('/compare', compareChar);

export default router;