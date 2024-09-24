import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB  } from './db/connectBD.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({ path: './config/.env' });

const corsOptions = {
  origin: process.env.CLIENT_URL, // The allowed origin for your frontend
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


//server
app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});