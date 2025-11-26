import express from "express";
import {
  getOrCreateDirectChat,
  createGroupChat,
  getUserChats,
  getChatById,
  sendMessage,
  getChatMessages,
  markMessagesAsRead,
  deleteMessage,
  searchChatsAndMessages
} from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============ Chat Routes ============

// Get all chats for user
router.get("/chats", authenticate, getUserChats);

// Get or create direct chat
router.post("/chats/direct", authenticate, getOrCreateDirectChat);

// Create group chat
router.post("/chats/group", authenticate, createGroupChat);

// Get specific chat
router.get("/chats/:chatId", authenticate, getChatById);

// Search chats and messages
router.get("/chats/search", authenticate, searchChatsAndMessages);

// ============ Message Routes ============

// Send message in a chat
router.post("/chats/:chatId/messages", authenticate, sendMessage);

// Get messages for a chat
router.get("/chats/:chatId/messages", authenticate, getChatMessages);

// Mark messages as read
router.put("/chats/:chatId/read", authenticate, markMessagesAsRead);

// Delete message for user
router.delete("/messages/:messageId", authenticate, deleteMessage);

export default router;
