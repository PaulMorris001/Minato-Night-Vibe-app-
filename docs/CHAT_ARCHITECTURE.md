# Chat System Architecture

This document outlines the complete chat system architecture implemented in the NightVibe application.

## Overview

The chat system is designed with scalability and maintainability in mind, following a clean separation of concerns with distinct layers for models, services, controllers, and UI components.

## Backend Architecture

### 1. Data Models

#### Chat Model (`/server/src/models/chat.model.js`)

- **Purpose**: Represents a chat conversation (direct or group)
- **Key Features**:
  - Supports both direct (1-on-1) and group chats
  - Tracks participants with user references
  - Stores last message for preview
  - Per-user settings: unread count, muted status, archived status
  - Group-specific: name, icon, admin roles
  - Performance indexes on participants and type

#### Message Model (`/server/src/models/message.model.js`)

- **Purpose**: Represents individual messages in chats
- **Key Features**:
  - Multiple message types: text, image, event, system
  - Message status tracking: sent, delivered, read
  - Read receipts for group chats
  - Reply functionality
  - Soft delete (per-user deletion)
  - Edit tracking
  - Performance indexes on chat, sender, and status

### 2. Service Layer (`/server/src/services/chat.service.js`)

The service layer contains all business logic, keeping controllers thin and focused on HTTP handling.

**Key Methods**:

- `getOrCreateDirectChat()` - Finds existing direct chat or creates new one
- `createGroupChat()` - Creates group chats with admin roles
- `getUserChats()` - Retrieves all chats for a user with pagination
- `getChatById()` - Gets specific chat with participant details
- `sendMessage()` - Creates message and updates chat metadata
- `getChatMessages()` - Retrieves messages with pagination
- `markMessagesAsRead()` - Updates read status and resets unread counts
- `deleteMessage()` - Soft deletes message for specific user
- `searchChatsAndMessages()` - Search functionality across chats and messages

### 3. Controller Layer (`/server/src/controllers/chat.controller.js`)

Handles HTTP requests/responses and delegates to service layer.

**Responsibilities**:

- Request validation
- Authentication checking
- Error handling
- Response formatting

### 4. Routes (`/server/src/routes/chat.route.js`)

RESTful API endpoints:

**Chat Routes**:

- `GET /api/chats` - Get all user chats
- `POST /api/chats/direct` - Get or create direct chat
- `POST /api/chats/group` - Create group chat
- `GET /api/chats/:chatId` - Get specific chat
- `GET /api/chats/search` - Search chats and messages

**Message Routes**:

- `POST /api/chats/:chatId/messages` - Send message
- `GET /api/chats/:chatId/messages` - Get chat messages
- `PUT /api/chats/:chatId/read` - Mark messages as read
- `DELETE /api/messages/:messageId` - Delete message

### 5. Real-time Structure (`/server/src/services/socket.service.js`)

Placeholder structure for Socket.io integration:

**Planned Features**:

- User online/offline status
- Real-time message delivery
- Typing indicators
- Read receipts
- Message delivery confirmations

**To Implement**:

1. Install socket.io: `npm install socket.io`
2. Uncomment code in socket.service.js
3. Initialize in server index.js
4. Emit events from message controller

## Mobile Architecture

### 1. API Service Layer (`/mobile/services/chat.service.ts`)

TypeScript service for all chat-related API calls.

**Key Features**:

- Type-safe interfaces for Chat, Message, User
- Centralized authentication header handling
- Error handling
- Token management via SecureStore

**Methods**:

- `getUserChats()` - Fetch all chats
- `getOrCreateDirectChat()` - Get/create direct chat
- `createGroupChat()` - Create group chat
- `getChatById()` - Get specific chat
- `sendMessage()` - Send text/image message
- `getChatMessages()` - Get message history
- `markMessagesAsRead()` - Mark as read
- `deleteMessage()` - Delete message
- `searchChatsAndMessages()` - Search functionality

### 2. Reusable Components

#### ChatListItem (`/mobile/components/chat/ChatListItem.tsx`)

- **Purpose**: Display chat in the list
- **Features**:
  - Avatar with placeholder for direct/group chats
  - Chat name (username for direct, group name for groups)
  - Last message preview
  - Timestamp formatting (Today, Yesterday, date)
  - Unread badge with count
  - Group indicator badge
  - Press handler for navigation

#### MessageBubble (`/mobile/components/chat/MessageBubble.tsx`)

- **Purpose**: Display individual message
- **Features**:
  - Different styling for own vs other messages
  - Support for all message types:
    - Text messages
    - Images with captions
    - Event shares
    - System messages
  - Reply message display
  - Read receipts (checkmarks)
  - Edit indicator
  - Timestamp
  - Avatar display (configurable)

#### ChatInput (`/mobile/components/chat/ChatInput.tsx`)

- **Purpose**: Message input component
- **Features**:
  - Multiline text input with auto-grow
  - Image picker button
  - Send button with state styling
  - Keyboard avoiding behavior
  - Character limit (1000)
  - Disabled state support

### 3. Screens

#### Chat List Screen (`/mobile/app/(tabs)/chats.tsx`)

- **Purpose**: Main chat interface showing all conversations
- **Features**:
  - List of all chats using ChatListItem
  - Search functionality
  - Pull-to-refresh
  - Empty state
  - New chat button (placeholder)
  - Navigation to individual chats

#### Individual Chat Screen (`/mobile/app/chat/[id].tsx`)

- **Purpose**: Conversation view for a specific chat
- **Features**:
  - Message list with MessageBubble components
  - Real-time scrolling to latest message
  - Chat header with avatar and participant info
  - Message input using ChatInput
  - Image sending capability
  - Auto-mark messages as read
  - Empty state
  - Settings button (placeholder)

### 4. Real-time Structure (`/mobile/services/socket.service.ts`)

Placeholder structure for Socket.io client integration:

**Planned Features**:

- Connect/disconnect from server
- Join/leave chat rooms
- Listen for new messages
- Send typing indicators
- Receive online/offline status
- Message delivery/read receipts

**To Implement**:

1. Install socket.io-client: `npm install socket.io-client`
2. Uncomment code in socket.service.ts
3. Connect service in app initialization
4. Integrate with chat screens

## Data Flow

### Sending a Message

1. User types message in ChatInput
2. ChatInput calls `onSend` handler from chat screen
3. Chat screen calls `chatService.sendMessage()`
4. Mobile service makes POST request to `/api/chats/:chatId/messages`
5. Server controller validates request
6. Controller delegates to chat service
7. Service creates message in database
8. Service updates chat's lastMessage and unread counts
9. Response returns new message object
10. Chat screen adds message to local state
11. FlatList scrolls to bottom
12. (Future) Socket.io emits message to other participants

### Loading Chats

1. Chats screen calls `chatService.getUserChats()`
2. Mobile service makes GET request to `/api/chats`
3. Server retrieves chats for authenticated user
4. Chats are sorted by last message time
5. Response includes participant details and last message
6. Chats screen updates state and displays using ChatListItem

### Real-time Updates (Future)

1. User connects to Socket.io server on app launch
2. User joins all their chat rooms
3. When message is sent by another user:
   - Server emits "message:new" to chat room
   - All connected clients receive the event
   - Chat screen adds message if chat is open
   - Chat list updates last message and unread count

## Security

- All routes protected with JWT authentication middleware
- Users can only access their own chats
- Message deletion is soft-delete per user
- Group chat admins have elevated permissions
- Socket connections require token authentication

## Performance Optimizations

- Database indexes on frequently queried fields
- Pagination for message history
- FlatList with proper keyExtractor and item optimization
- Image compression before upload
- Lazy loading of chat messages

## Scalability Considerations

- Service layer separation allows easy business logic changes
- Component reusability reduces code duplication
- Type safety with TypeScript interfaces
- Clean architecture allows easy feature additions
- Socket.io structure ready for horizontal scaling with adapters

## Future Enhancements

1. **Real-time Messaging**
   - Socket.io integration
   - Typing indicators
   - Online/offline status
   - Message delivery confirmations

2. **Media Sharing**
   - Video messages
   - Audio messages
   - File attachments
   - GIF support

3. **Advanced Features**
   - Message reactions
   - Message forwarding
   - Voice calls
   - Video calls
   - Screen sharing

4. **Group Chat Features**
   - Add/remove participants
   - Change group name/icon
   - Admin controls
   - Group permissions

5. **Notifications**
   - Push notifications for new messages
   - In-app notifications
   - Notification settings per chat

## Testing

To test the chat system:

1. Create at least two user accounts
2. Use one account to send messages
3. Use the other account to verify message receipt
4. Test all message types (text, image, event)
5. Test group chat creation and messaging
6. Test search functionality
7. Test message deletion
8. Verify unread counts update correctly

## Troubleshooting

**Messages not appearing**:

- Check server logs for errors
- Verify authentication token is valid
- Check network requests in browser/app debugger

**Images not sending**:

- Verify image picker permissions
- Check image size (may need compression)
- Verify base64 encoding is working

**Chats not loading**:

- Check API endpoint is reachable
- Verify user is authenticated
- Check MongoDB connection

## Implementation Checklist

- [x] Backend chat model
- [x] Backend message model
- [x] Chat service layer
- [x] Chat controller
- [x] Chat routes
- [x] Mobile chat service
- [x] ChatListItem component
- [x] MessageBubble component
- [x] ChatInput component
- [x] Chat list screen
- [x] Individual chat screen
- [ ] Socket.io server setup
- [ ] Socket.io client setup
- [ ] Real-time message delivery
- [ ] Typing indicators
- [ ] Push notifications
- [ ] Group chat management UI
- [ ] Advanced media sharing
