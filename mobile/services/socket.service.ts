/**
 * Socket Service - Real-time Communication
 *
 * This service provides the structure for real-time messaging using WebSocket/Socket.io.
 * It's currently a placeholder that can be integrated when real-time features are needed.
 *
 * To implement:
 * 1. Install socket.io-client: npm install socket.io-client
 * 2. Set up Socket.io server on the backend
 * 3. Uncomment and configure the code below
 * 4. Connect the service to chat screens for real-time updates
 */

import * as SecureStore from "expo-secure-store";
// import io, { Socket } from "socket.io-client";

// const SOCKET_URL = "http://192.168.1.206:3000"; // Replace with your server URL

interface SocketEvents {
  onNewMessage?: (message: any) => void;
  onMessageRead?: (data: any) => void;
  onTypingStart?: (data: any) => void;
  onTypingStop?: (data: any) => void;
  onUserOnline?: (userId: string) => void;
  onUserOffline?: (userId: string) => void;
}

class SocketService {
  // private socket: Socket | null = null;
  private events: SocketEvents = {};
  private connected = false;

  /**
   * Initialize and connect to the socket server
   */
  async connect() {
    try {
      // Get authentication token
      const token = await SecureStore.getItemAsync("token");
      if (!token) {
        console.error("No auth token found");
        return;
      }

      console.log("Socket service ready (not connected - implement Socket.io first)");

      /*
      // Uncomment when implementing Socket.io:

      this.socket = io(SOCKET_URL, {
        auth: {
          token,
        },
        transports: ["websocket"],
      });

      this.socket.on("connect", () => {
        console.log("Socket connected:", this.socket?.id);
        this.connected = true;
      });

      this.socket.on("disconnect", () => {
        console.log("Socket disconnected");
        this.connected = false;
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      // Listen for new messages
      this.socket.on("message:new", (message) => {
        if (this.events.onNewMessage) {
          this.events.onNewMessage(message);
        }
      });

      // Listen for message read receipts
      this.socket.on("message:read", (data) => {
        if (this.events.onMessageRead) {
          this.events.onMessageRead(data);
        }
      });

      // Listen for typing indicators
      this.socket.on("typing:start", (data) => {
        if (this.events.onTypingStart) {
          this.events.onTypingStart(data);
        }
      });

      this.socket.on("typing:stop", (data) => {
        if (this.events.onTypingStop) {
          this.events.onTypingStop(data);
        }
      });

      // Listen for online/offline status
      this.socket.on("user:online", (userId) => {
        if (this.events.onUserOnline) {
          this.events.onUserOnline(userId);
        }
      });

      this.socket.on("user:offline", (userId) => {
        if (this.events.onUserOffline) {
          this.events.onUserOffline(userId);
        }
      });
      */
    } catch (error) {
      console.error("Socket connection error:", error);
    }
  }

  /**
   * Disconnect from the socket server
   */
  disconnect() {
    /*
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
    */
    console.log("Socket disconnected");
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Join a chat room
   */
  joinChat(chatId: string) {
    /*
    if (this.socket) {
      this.socket.emit("chat:join", chatId);
    }
    */
    console.log(`Would join chat: ${chatId}`);
  }

  /**
   * Leave a chat room
   */
  leaveChat(chatId: string) {
    /*
    if (this.socket) {
      this.socket.emit("chat:leave", chatId);
    }
    */
    console.log(`Would leave chat: ${chatId}`);
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatId: string, isTyping: boolean) {
    /*
    if (this.socket) {
      this.socket.emit(isTyping ? "typing:start" : "typing:stop", { chatId });
    }
    */
    console.log(`Would send typing: ${isTyping} for chat: ${chatId}`);
  }

  /**
   * Mark message as delivered
   */
  markDelivered(messageId: string) {
    /*
    if (this.socket) {
      this.socket.emit("message:delivered", { messageId });
    }
    */
    console.log(`Would mark delivered: ${messageId}`);
  }

  /**
   * Register event listeners
   */
  on(events: SocketEvents) {
    this.events = { ...this.events, ...events };
  }

  /**
   * Remove event listeners
   */
  off() {
    this.events = {};
  }
}

// Export singleton instance
export default new SocketService();
