import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";
import { useRouter } from "expo-router";
import type { Message } from "@/services/chat.service";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showSender?: boolean;
  onLongPress?: () => void;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  showSender = false,
  onLongPress,
}: MessageBubbleProps) {
  const router = useRouter();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEventPress = () => {
    if (message.event && message.event._id) {
      router.push(`/event/${message.event._id}`);
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case "text":
        return (
          <View>
            {message.replyTo && (
              <View style={styles.replyContainer}>
                <View style={styles.replyBar} />
                <View style={styles.replyContent}>
                  <Text style={styles.replyUsername}>
                    {message.replyTo.sender.username}
                  </Text>
                  <Text style={styles.replyText} numberOfLines={2}>
                    {message.replyTo.content}
                  </Text>
                </View>
              </View>
            )}
            <Text
              style={[
                styles.messageText,
                isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
              ]}
            >
              {message.content}
            </Text>
            {message.isEdited && (
              <Text
                style={[
                  styles.editedText,
                  isOwnMessage ? styles.ownEditedText : styles.otherEditedText,
                ]}
              >
                edited
              </Text>
            )}
          </View>
        );

      case "image":
        return (
          <View>
            {message.imageUrl && (
              <Image
                source={{ uri: message.imageUrl }}
                style={styles.messageImage}
                resizeMode="cover"
              />
            )}
            {message.content && (
              <Text
                style={[
                  styles.messageText,
                  isOwnMessage
                    ? styles.ownMessageText
                    : styles.otherMessageText,
                  { marginTop: 8 },
                ]}
              >
                {message.content}
              </Text>
            )}
          </View>
        );

      case "event":
        return (
          <TouchableOpacity
            style={styles.eventContainer}
            onPress={handleEventPress}
            activeOpacity={0.7}
          >
            <View style={styles.eventIconContainer}>
              <Ionicons name="calendar" size={24} color="#a855f7" />
            </View>
            <View style={styles.eventContent}>
              <Text
                style={[
                  styles.eventText,
                  isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
                ]}
              >
                {message.content}
              </Text>
              <Text style={styles.eventTapHint}>
                Tap to view details
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isOwnMessage ? "rgba(255, 255, 255, 0.7)" : "#9ca3af"}
            />
          </TouchableOpacity>
        );

      case "system":
        return (
          <Text style={styles.systemText}>{message.content}</Text>
        );

      default:
        return null;
    }
  };

  if (message.type === "system") {
    return (
      <View style={styles.systemContainer}>
        <View style={styles.systemBubble}>{renderContent()}</View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.ownContainer : styles.otherContainer,
      ]}
    >
      {!isOwnMessage && showSender && (
        <Text style={styles.senderName}>{message.sender.username}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        {renderContent()}

        <View style={styles.footer}>
          <Text
            style={[
              styles.timeText,
              isOwnMessage ? styles.ownTimeText : styles.otherTimeText,
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>

          {isOwnMessage && (
            <Ionicons
              name={
                message.status === "read"
                  ? "checkmark-done"
                  : message.status === "delivered"
                  ? "checkmark-done"
                  : "checkmark"
              }
              size={16}
              color={message.status === "read" ? "#a855f7" : "#9ca3af"}
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: "80%",
  },
  ownContainer: {
    alignSelf: "flex-end",
  },
  otherContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    minWidth: 60,
  },
  ownBubble: {
    backgroundColor: "#a855f7",
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: "#374151",
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: "#9ca3af",
    marginBottom: 4,
    marginLeft: 12,
  },
  messageText: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  ownMessageText: {
    color: "#fff",
  },
  otherMessageText: {
    color: "#e5e7eb",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    justifyContent: "flex-end",
  },
  timeText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
  },
  ownTimeText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherTimeText: {
    color: "#9ca3af",
  },
  editedText: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    fontStyle: "italic",
    marginTop: 2,
  },
  ownEditedText: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherEditedText: {
    color: "#9ca3af",
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  replyContainer: {
    flexDirection: "row",
    marginBottom: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 8,
  },
  replyBar: {
    width: 3,
    backgroundColor: "#a855f7",
    borderRadius: 2,
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyUsername: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: "#a855f7",
    marginBottom: 2,
  },
  replyText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: "rgba(255, 255, 255, 0.7)",
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(168, 85, 247, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  eventTapHint: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    marginTop: 4,
    fontStyle: "italic",
  },
  systemContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  systemBubble: {
    backgroundColor: "rgba(55, 65, 81, 0.5)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  systemText: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
    textAlign: "center",
  },
});
