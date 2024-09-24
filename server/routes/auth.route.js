import express from 'express';
import { register, signIn, signOut, verifyEmail, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.get('/check-auth', verifyToken, checkAuth)

router.post('/register', register);
router.post('/login', signIn);
router.get('/logout', signOut);

router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;