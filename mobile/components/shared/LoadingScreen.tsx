import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Fonts } from "@/constants/fonts";

interface LoadingScreenProps {
  message?: string;
  size?: "small" | "large";
  color?: string;
}

export default function LoadingScreen({
  message,
  size = "large",
  color = "#a855f7",
}: LoadingScreenProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    color: "#9ca3af",
  },
});
