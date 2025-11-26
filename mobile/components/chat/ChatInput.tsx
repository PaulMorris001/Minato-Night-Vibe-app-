import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Fonts } from "@/constants/fonts";

interface ChatInputProps {
  onSend: (message: string) => void;
  onImagePick?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onSend,
  onImagePick,
  placeholder = "Type a message...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.container}>
        {onImagePick && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onImagePick}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Ionicons name="image-outline" size={24} color="#a855f7" />
          </TouchableOpacity>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder={placeholder}
            placeholderTextColor="#6b7280"
            multiline
            maxLength={1000}
            editable={!disabled}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            message.trim() && !disabled
              ? styles.sendButtonActive
              : styles.sendButtonInactive,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || disabled}
          activeOpacity={0.7}
        >
          <Ionicons
            name="send"
            size={20}
            color={message.trim() && !disabled ? "#fff" : "#6b7280"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1f1f2e",
    borderTopWidth: 1,
    borderTopColor: "#374151",
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: "#374151",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 120,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: "#fff",
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: "#a855f7",
  },
  sendButtonInactive: {
    backgroundColor: "#374151",
  },
});
