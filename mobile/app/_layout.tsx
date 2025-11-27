import { Stack } from "expo-router";
import React, { useEffect } from "react";
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
import { PortalProvider } from "@gorhom/portal";
import { AccountProvider } from "@/contexts/AccountContext";
import socketService from "@/services/socket.service";

// Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AccountProvider>
      <PortalProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PortalProvider>
    </AccountProvider>
  );
}