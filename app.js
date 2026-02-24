import express from 'express';
import dotenv from 'dotenv';
import  cors from 'cors'; 
import cookieParser from 'cookie-parser';
import userRoute from './routes/user.route.js';
import blogRoute from './routes/blog.route.js';

 const app = express();
 dotenv.config({ path: './.env' });
 app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
 }));
 app.use(cookieParser());
 app.use(express.json());
 app.use(express.urlencoded({extended: true}));
 app.use(express.static('public'));


 app.use('/api/user', userRoute);
 app.use('/api/blog', blogRoute);

 
 export { app };