import messaging from "@react-native-firebase/messaging";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/constants";

export async function registerForPushNotifications() {
  console.log("[PushNotif] Starting Firebase registration...");

  if (!Device.isDevice) {
    console.log("[PushNotif] Skipped — not a physical device");
    return;
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log("[PushNotif] Permission denied — aborting");
    return;
  }

  let token: string;
  try {
    token = await messaging().getToken();
    console.log("[PushNotif] Got FCM token:", token);
  } catch (err) {
    console.error("[PushNotif] Could not get FCM token:", err);
    return;
  }

  const authToken = await SecureStore.getItemAsync("token");
  console.log("[PushNotif] Auth token present:", !!authToken);

  if (authToken && token) {
    try {
      const res = await fetch(`${BASE_URL}/notifications/token`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ token }),
      });
      console.log("[PushNotif] FCM token saved to backend, status:", res.status);
    } catch (err) {
      console.error("[PushNotif] Failed to save token to backend:", err);
    }
  } else {
    console.log("[PushNotif] Skipped backend save — authToken:", !!authToken, "token:", !!token);
  }
}
