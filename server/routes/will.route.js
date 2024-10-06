import express from "express";
import { getVideoId, killornot, getAnswer, getWillItKillOfTheDay } from '../controllers/willitkill.controller.js'

const router = express.Router();

router.get('/video-id', getVideoId)
router.get('/killornot', killornot)
router.post('/compare', getAnswer)
router.post('/willitkilloftheday', getWillItKillOfTheDay)

export default router;