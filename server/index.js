import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB  } from './db/connectBD.js';
import authRoutes from './routes/auth.route.js';
import charRoutes from './routes/char.route.js';
import willRoutes from './routes/will.route.js';
import achievRoutes from './routes/achiev.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cron from 'node-cron';

import { selectCharacterOfTheDay } from './controllers/char.controller.js';
import { selectBlindOfTheDay } from './controllers/char.controller.js';
import { selectEmojiOfTheDay } from './controllers/char.controller.js';
import { selectWillItKillOfTheDay } from './controllers/willitkill.controller.js';

dotenv.config({ path: './config/.env' });

const corsOptions = {
  origin: process.env.CLIENT_URL, // The allowed origin the frontend
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  allowedHeaders: ['sessionId', 'Content-Type'], // Specify allowed headers
  exposedHeaders: ['sessionId'], // Headers that can be exposed to the client
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'], // Allowed HTTP methods
  preflightContinue: false, // Whether to pass the CORS preflight response to the next handler
}

const app  = express();

//middlewares
app
  .use(cors(corsOptions))
  .use(morgan('dev'))
  .use(express.json()) //body parser 
  .use(cookieParser()); // cookie parser


//routes
app.use('/api/auth', authRoutes);
app.use('/api/char', charRoutes);
app.use('/api/willitkill', willRoutes);
app.use('/api/achiev', achievRoutes);

// Schedule the task to run at midnight UTC every day
cron.schedule('* * * * *', async () => {
  try {
    await selectCharacterOfTheDay();
    await selectBlindOfTheDay();
    await selectEmojiOfTheDay();
    await selectWillItKillOfTheDay();
    console.log('Character of the day selected successfully at midnight UTC');
  } catch (error) {
    console.error('Error selecting character of the day:', error);
  }
});

//server
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});