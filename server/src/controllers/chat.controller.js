import ChatService from "../services/chat.service.js";
import User from "../models/user.model.js";

/**
 * Chat Controller - Handles HTTP requests for chat operations
 */

// Create or get a direct chat with another user
export const getOrCreateDirectChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID is required" });
    }

    if (userId === otherUserId) {
      return res.status(400).json({ message: "Cannot create chat with yourself" });
    }

    // Verify other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const chat = await ChatService.getOrCreateDirectChat(userId, otherUserId);

    res.status(200).json({
      message: "Chat retrieved successfully",
      chat
    });
  } catch (error) {
    console.error("Get/Create direct chat error:", error);
    res.status(500).json({ message: "Error creating chat", error: error.message });
  }
};

// Create a group chat
export const createGroupChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, participantIds, groupImage } = req.body;

    if (!name || !participantIds || participantIds.length < 2) {
      return res.status(400).json({
        message: "Group name and at least 2 participants are required"
      });
    }

    const chat = await ChatService.createGroupChat(
      name,
      participantIds,
      userId,
      groupImage
    );

    res.status(201).json({
      message: "Group chat created successfully",
      chat
    });
  } catch (error) {
    console.error("Create group chat error:", error);
    res.status(500).json({ message: "Error creating group chat", error: error.message });
  }
};

// Get all chats for the authenticated user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await ChatService.getUserChats(userId);

    res.status(200).json({
      chats,
      count: chats.length
    });
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({ message: "Error fetching chats", error: error.message });
  }
};

// Get a specific chat by ID
export const getChatById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'username email profilePicture')
      .populate('admins', 'username email profilePicture')
      .populate({
        path: 'lastMessage',
        populate: { path: 'sender', select: 'username profilePicture' }
      });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Verify user is participant
    if (!chat.participants.some(p => p._id.toString() === userId)) {
      return res.status(403).json({ message: "You don't have access to this chat" });
    }

    res.status(200).json({ chat });
  } catch (error) {
    console.error("Get chat error:", error);
    res.status(500).json({ message: "Error fetching chat", error: error.message });
  }
};

// Send a message in a chat
export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const messageData = req.body;

    const message = await ChatService.sendMessage(chatId, userId, messageData);

    res.status(201).json({
      message: "Message sent successfully",
      data: message
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: error.message || "Error sending message" });
  }
};

// Get messages for a chat
export const getChatMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const result = await ChatService.getChatMessages(chatId, userId, page, limit);

    res.status(200).json(result);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: error.message || "Error fetching messages" });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { chatId } = req.params;

    await ChatService.markMessagesAsRead(chatId, userId);

    res.status(200).json({ message: "Messages marked as read" });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: error.message || "Error marking messages as read" });
  }
};

// Delete message for user
export const deleteMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    await ChatService.deleteMessageForUser(messageId, userId);

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({ message: error.message || "Error deleting message" });
  }
};

// Search chats and messages
export const searchChatsAndMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: "Search query must be at least 2 characters" });
    }

    const results = await ChatService.searchChatsAndMessages(userId, query);

    res.status(200).json(results);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching", error: error.message });
  }
};
