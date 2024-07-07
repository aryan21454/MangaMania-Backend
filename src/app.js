import cors from 'cors';
import express from 'express';
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import mangaRouter from './routes/manga.routes.js'
 const app = express();; 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(cors({
    origin: `${process.env.URL}`, // Replace with your frontend URL
    credentials : true ,
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', `${process.env.URL}`); // replace with your frontend URL
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

import userRouter from './routes/user.routes.js'
app.use("/api/v1/users", userRouter);
app.use("/api/v1/mangas", mangaRouter); 
export {app}

