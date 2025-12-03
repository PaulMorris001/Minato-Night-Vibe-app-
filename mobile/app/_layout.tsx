import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import {
  useFonts,
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
  Outfit_900Black,
} from "@expo-google-fonts/outfit";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import { setBackgroundColorAsync } from "expo-system-ui";
import { PortalProvider } from "@gorhom/portal";
import { AccountProvider } from "@/contexts/AccountContext";
import socketService from "@/services/socket.service";
import { theme } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() || "dark";

  const [fontsLoaded] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();

      // Initialize socket connection
      socketService.connect();
    }

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, [fontsLoaded]);

  // Set navigation bar color for Android
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(
        colorScheme === "light" ? "dark" : "light"
      );
      NavigationBar.setBackgroundColorAsync(
        colorScheme === "dark"
          ? theme.colors.dark.background
          : theme.colors.light.background
      );
    }
  }, [colorScheme]);

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark"
        ? theme.colors.dark.background
        : theme.colors.light.background
    );
  }, [colorScheme]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AccountProvider>
      <PortalProvider>
        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor:
                colorScheme === "dark"
                  ? theme.colors.dark.background
                  : theme.colors.light.background,
            },
          }}
        />
      </PortalProvider>
    </AccountProvider>
  );
}