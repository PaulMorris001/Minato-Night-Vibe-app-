import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js'

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*", // allow all origins (safe for development)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
connectDB();

app.use("/api/", authRoutes)

app.listen(process.env.PORT, ()=>{console.log("Backend started at port: ", process.env.PORT)})