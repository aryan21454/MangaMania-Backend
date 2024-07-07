import cors from 'cors';
import express from 'express';
import cookieParser from "cookie-parser";
import mangaRouter from './routes/manga.routes.js'
 const app = express();; 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    credentials : true
}));
export {app}

import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter);
app.use("/api/v1/mangas", mangaRouter); 

