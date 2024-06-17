
import express from "express";
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from "./routes/index.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
config();

const app = express();

//*** Middlewares  *** 
app.use(cors({origin: '*', credentials: true}))
//it will parse imconing data as json
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
//need to removed in production
app.use(morgan('dev'))

app.use('/api/v1', appRouter)


export default app;