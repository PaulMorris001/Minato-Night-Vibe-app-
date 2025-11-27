import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { initializeSocket } from './services/socket.service.js';

import authRoutes from './routes/auth.route.js'
import vendorRoutes from "./routes/vendor.route.js";
import serviceRoutes from "./routes/service.route.js";
import eventRoutes from "./routes/event.route.js";
import chatRoutes from "./routes/chat.route.js";

dotenv.config();
const app = express();
const httpServer = createServer(app);

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
app.use("/api/", eventRoutes);
app.use("/api/", chatRoutes);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(PORT, HOST, async () => {
  console.log(`🚀 Backend started at http://${HOST}:${PORT}`);
  await connectDB();
});