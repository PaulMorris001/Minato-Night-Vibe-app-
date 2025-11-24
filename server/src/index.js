import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js'
import vendorRoutes from "./routes/vendor.route.js";
import serviceRoutes from "./routes/service.route.js";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/api/", authRoutes);
app.use("/api/", vendorRoutes);
app.use("/api/", serviceRoutes);

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, async () => {
  console.log(`🚀 Backend started at http://${HOST}:${PORT}`);
  await connectDB();
});