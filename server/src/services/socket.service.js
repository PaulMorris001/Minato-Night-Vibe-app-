/**
 * Socket Service - Real-time Communication Handler
 *
 * This service provides the structure for real-time messaging using Socket.io.
 * It's currently a placeholder that can be integrated when real-time features are needed.
 *
 * To implement:
 * 1. Install socket.io: npm install socket.io
 * 2. Uncomment the code in this file
 * 3. Import and initialize in server index.js
 * 4. Update Message model to emit socket events on creation
 */

import jwt from "jsonwebtoken";

/**
 * Initialize Socket.io server
 *
 * @param {object} server - HTTP server instance
 */
export const initializeSocket = (server) => {
  console.log("Socket service ready (not initialized - install socket.io first)");

  /*
  // Uncomment when implementing Socket.io:

  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Store connected users
  const connectedUsers = new Map(); // userId -> socketId

  // Authentication middleware
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Connection handler
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId} (${socket.id})`);

    // Store user connection
    connectedUsers.set(socket.userId, socket.id);

    // Notify others that user is online
    socket.broadcast.emit("user:online", socket.userId);

    // Join user's personal room for direct messages
    socket.join(`user:${socket.userId}`);

    // ============ Chat Events ============

    // Join a chat room
    socket.on("chat:join", (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    // Leave a chat room
    socket.on("chat:leave", (chatId) => {
      socket.leave(`chat:${chatId}`);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    // ============ Message Events ============

    // New message (emitted from controller after saving to DB)
    // This is called by the message controller, not directly by socket
    socket.onNewMessage = (message) => {
      // Emit to all participants in the chat
      io.to(`chat:${message.chat}`).emit("message:new", message);
    };

    // Message delivered
    socket.on("message:delivered", ({ messageId }) => {
      // Update message status in DB and notify sender
      io.emit("message:delivered", { messageId });
    });

    // Message read
    socket.on("message:read", ({ chatId, userId }) => {
      // Emit to chat participants
      io.to(`chat:${chatId}`).emit("message:read", { chatId, userId });
    });

    // ============ Typing Events ============

    // User started typing
    socket.on("typing:start", ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit("typing:start", {
        chatId,
        userId: socket.userId,
      });
    });

    // User stopped typing
    socket.on("typing:stop", ({ chatId }) => {
      socket.to(`chat:${chatId}`).emit("typing:stop", {
        chatId,
        userId: socket.userId,
      });
    });

    // ============ Disconnect ============

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId} (${socket.id})`);

      // Remove from connected users
      connectedUsers.delete(socket.userId);

      // Notify others that user is offline
      socket.broadcast.emit("user:offline", socket.userId);
    });
  });

  return io;
  */

  return null;
};

/**
 * Get Socket.io instance
 * Use this to emit events from controllers
 */
let socketInstance = null;

export const setSocketInstance = (io) => {
  socketInstance = io;
};

export const getSocketInstance = () => {
  return socketInstance;
};

/**
 * Emit new message to chat participants
 *
 * @param {string} chatId - Chat ID
 * @param {object} message - Message object
 */
export const emitNewMessage = (chatId, message) => {
  /*
  if (socketInstance) {
    socketInstance.to(`chat:${chatId}`).emit("message:new", message);
  }
  */
  console.log(`Would emit new message to chat ${chatId}`);
};

/**
 * Emit message read status
 *
 * @param {string} chatId - Chat ID
 * @param {string} userId - User ID who read the message
 */
export const emitMessageRead = (chatId, userId) => {
  /*
  if (socketInstance) {
    socketInstance.to(`chat:${chatId}`).emit("message:read", { chatId, userId });
  }
  */
  console.log(`Would emit message read for chat ${chatId} by user ${userId}`);
};

/**
 * Check if user is online
 *
 * @param {string} userId - User ID to check
 * @returns {boolean} - Whether user is online
 */
export const isUserOnline = (userId) => {
  /*
  if (socketInstance) {
    const sockets = socketInstance.sockets.sockets;
    for (const [_, socket] of sockets) {
      if (socket.userId === userId) {
        return true;
      }
    }
  }
  */
  return false;
};
