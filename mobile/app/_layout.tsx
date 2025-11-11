import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/colors";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.darkBackground }}>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaView>
  );
}