
import express from "express";
import { config } from 'dotenv';
import morgan from 'morgan';
import appRouter from "./routes/index.js";
import cors from 'cors';
import cookieParser from "cookie-parser";
config();

const app = express();

//*** Middlewares  *** 
// Allowed origins
const allowedOrigins = ['http://219.94.251.92'];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization'
};


app.use(cors(corsOptions))
//it will parse imconing data as json
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))
//need to removed in production
app.use(morgan('dev'))

app.use('/api/v1', appRouter)


export default app;