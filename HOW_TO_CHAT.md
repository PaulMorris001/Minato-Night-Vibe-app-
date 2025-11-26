# How to Use the Chat Feature

## Overview

The NightVibe chat system allows users to message each other directly. Here's how to start chatting:

## Starting a New Chat

### Method 1: From the Messages Tab (Primary Method)

1. **Navigate to Messages Tab**
   - Open the app and tap on the "Messages" tab in the bottom navigation

2. **Tap the New Chat Button**
   - In the top right corner, tap the purple pencil/create icon

3. **Search for a User**
   - A modal will appear with a search bar
   - Type at least 2 characters of a username or email
   - Search results will appear as you type (debounced for performance)

4. **Select a User**
   - Tap on any user from the search results
   - This will automatically:
     - Create a direct chat (or open existing one if you've chatted before)
     - Navigate you to the conversation screen
     - You can start messaging immediately!

### Method 2: Using the Helper Function (For Developers)

You can programmatically start a chat from anywhere in the app:

```typescript
import { startChatWithUser } from "@/utils/chatHelpers";

// In any component
const handleMessageUser = async (userId: string) => {
  await startChatWithUser(userId);
};
```

**Example Use Cases**:
- Add a "Message" button on vendor profiles
- Add "Message Host" on event pages
- Add "Message" in user search/discovery features
- Add "Message Vendor" in booking flows

## Sending Messages

Once in a chat:

1. **Text Messages**
   - Type your message in the input box at the bottom
   - Tap the send button (arrow icon)
   - Message appears immediately for you, and is saved to the database

2. **Image Messages**
   - Tap the image icon (left of input box)
   - Select an image from your library
   - Image is compressed and sent automatically
   - Images display in the chat with optional captions

## Chat Features

### In the Messages List
- **Search Chats**: Search bar filters your existing conversations
- **Unread Badges**: Red badges show unread message counts
- **Last Message Preview**: See the most recent message
- **Time Stamps**: Shows when last message was sent
- **Pull to Refresh**: Swipe down to refresh chat list
- **Vendor Indicator**: Group chats show a group icon badge

### In a Conversation
- **Auto-scroll**: Automatically scrolls to latest message
- **Avatar Display**: Shows user profile pictures
- **Message Types**:
  - Text messages (white bubbles)
  - Images (with zoom capability)
  - Event shares (special card format)
  - System messages (centered, gray)
- **Read Receipts**: Double checkmarks when messages are read
- **Edit Indicator**: Shows if a message was edited
- **Time Stamps**: Each message shows send time

## User Search Details

The search functionality:
- **Minimum Characters**: Need at least 2 characters to search
- **Search Fields**: Searches both username and email
- **Debounced**: Waits 300ms after typing to avoid excessive API calls
- **Excludes**: You won't see yourself in search results
- **Results Limit**: Shows up to 20 users
- **Vendor Badge**: Vendors are marked with a purple "Vendor" badge

## Technical Flow

### Creating a New Chat

```
User taps "New Chat" button
    ↓
Modal opens with search
    ↓
User types username/email (≥2 chars)
    ↓
API searches users (GET /api/users/search)
    ↓
Results displayed with avatars, names, vendor badges
    ↓
User taps a result
    ↓
API creates/retrieves direct chat (POST /api/chats/direct)
    ↓
App navigates to chat screen (/chat/[id])
    ↓
User can send messages immediately
```

### Sending a Message

```
User types message and taps send
    ↓
Message appears in chat immediately (optimistic UI)
    ↓
API creates message (POST /api/chats/:chatId/messages)
    ↓
Server saves to database and updates chat metadata
    ↓
Response confirms message saved
    ↓
Chat list updates with new "last message"
```

## API Endpoints Used

- **Search Users**: `GET /api/users/search?query={searchTerm}`
- **Create/Get Direct Chat**: `POST /api/chats/direct` with `{ otherUserId }`
- **Get User Chats**: `GET /api/chats`
- **Get Chat Details**: `GET /api/chats/:chatId`
- **Send Message**: `POST /api/chats/:chatId/messages`
- **Get Messages**: `GET /api/chats/:chatId/messages`
- **Mark as Read**: `PUT /api/chats/:chatId/read`

## Future Enhancements

The current implementation is ready to be extended with:

1. **Real-time Updates** (Socket.io)
   - Install socket.io packages
   - Uncomment code in `/mobile/services/socket.service.ts`
   - Uncomment code in `/server/src/services/socket.service.js`
   - Initialize in server and connect in app

2. **Message Features**
   - Add "Message" buttons throughout the app
   - Example locations:
     - Vendor profile pages
     - Event invitation screens
     - User profile views
     - Friend discovery features

3. **Group Chats**
   - Create group chat UI
   - Add participants management
   - Group admin controls

4. **Rich Media**
   - Video messages
   - Voice messages
   - File attachments
   - GIF support

5. **Notifications**
   - Push notifications for new messages
   - Badge counts on app icon
   - In-app notification banners

## Integration Examples

### Add "Message" Button to Vendor Profile

```typescript
import { startChatWithUser } from "@/utils/chatHelpers";

// In your vendor profile component
<TouchableOpacity
  style={styles.messageButton}
  onPress={() => startChatWithUser(vendor.userId)}
>
  <Ionicons name="chatbubble-outline" size={20} color="#fff" />
  <Text style={styles.messageButtonText}>Message Vendor</Text>
</TouchableOpacity>
```

### Add "Message Host" to Event Page

```typescript
import { startChatWithUser } from "@/utils/chatHelpers";

// In your event details component
<TouchableOpacity
  style={styles.contactButton}
  onPress={() => startChatWithUser(event.createdBy._id)}
>
  <Text>Contact Event Host</Text>
</TouchableOpacity>
```

### Add "Message" to Search Results

```typescript
import { startChatWithUser } from "@/utils/chatHelpers";

// In your user search/discovery feature
const handleMessageUser = (userId: string) => {
  startChatWithUser(userId);
};
```

## Troubleshooting

**Can't find a user?**
- Make sure you're typing at least 2 characters
- Check spelling of username/email
- User must be registered in the system

**Chat not opening?**
- Check internet connection
- Verify you're logged in
- Check server is running

**Messages not sending?**
- Verify chat screen loaded successfully
- Check network connection
- Try refreshing the chat

**Images not sending?**
- Check app has permission to access photos
- Image might be too large (compression applied automatically)
- Check network connection for upload

## Testing the Feature

To test the chat system:

1. **Create Two Accounts**
   - Register two different users
   - Or use an existing account and create a new one

2. **Start a Chat**
   - Log in with first account
   - Go to Messages tab
   - Tap new chat button
   - Search for second user
   - Tap to start chat

3. **Send Messages**
   - Send text messages
   - Send images
   - Verify they appear correctly

4. **Switch Accounts**
   - Log out and log in with second account
   - Check Messages tab
   - Should see the chat with unread badge
   - Open chat and verify messages received

5. **Reply**
   - Send messages from second account
   - Switch back to first account
   - Verify conversation updates

## Files Involved

**Backend**:
- `/server/src/controllers/auth.controller.js` - User search endpoint
- `/server/src/routes/auth.route.js` - Search route
- `/server/src/models/chat.model.js` - Chat data model
- `/server/src/models/message.model.js` - Message data model
- `/server/src/services/chat.service.js` - Business logic
- `/server/src/controllers/chat.controller.js` - HTTP handlers
- `/server/src/routes/chat.route.js` - API routes

**Mobile**:
- `/mobile/app/(tabs)/chats.tsx` - Chat list screen with search modal
- `/mobile/app/chat/[id].tsx` - Individual conversation screen
- `/mobile/services/chat.service.ts` - API client
- `/mobile/utils/chatHelpers.ts` - Helper functions
- `/mobile/components/chat/ChatListItem.tsx` - Chat preview component
- `/mobile/components/chat/MessageBubble.tsx` - Message component
- `/mobile/components/chat/ChatInput.tsx` - Input component

## Summary

The chat system is fully functional and ready to use! Users can:
- ✅ Search for other users by username or email
- ✅ Start direct 1-on-1 conversations
- ✅ Send text messages
- ✅ Send images
- ✅ View message history
- ✅ See unread counts
- ✅ Get automatic read receipts

The architecture is clean, scalable, and ready for future enhancements like real-time messaging, group chats, and rich media support.
