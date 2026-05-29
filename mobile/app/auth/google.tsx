import React from "react";
import { View, ActivityIndicator } from "react-native";

/**
 * Stub route for the OAuth callback URL `mobile://auth/google?token=…&user=…`.
 *
 * On Android, when our server redirects the browser to that custom-scheme URL,
 * the OS dispatches it through TWO listeners in parallel:
 *   1. `WebBrowser.openAuthSessionAsync` (in `signInWithGoogleWeb`) — captures
 *      the URL, parses token+user out of the query string, and resolves so
 *      `SocialAuthButtons.handleGoogleSignIn` can call `finishAuth` →
 *      `router.replace("/(tabs)/home")`.
 *   2. expo-router's built-in linking — tries to match `/auth/google` against
 *      the file-based route tree. Without this file, it would render the
 *      "Unmatched Route" screen for a beat before `router.replace` lands.
 *
 * On iOS this file is never rendered (ASWebAuthenticationSession intercepts
 * the callback URL before it reaches the app's URL handler), but we keep the
 * route defined for both platforms so the behavior matches.
 *
 * The component renders only a spinner: the real work is happening in
 * parallel in `signInWithGoogleWeb`, and any moment now `router.replace`
 * from `finishAuth` will swap us out for the home tab (or the vendor role
 * picker on top of the previous screen).
 */
export default function GoogleAuthCallback() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0a1f",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color="#a855f7" />
    </View>
  );
}
