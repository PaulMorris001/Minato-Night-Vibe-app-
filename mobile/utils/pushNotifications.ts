import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "@/constants/constants";

/**
 * Request push notification permission, get the Expo push token,
 * and save it to the backend. Safe to call multiple times — no-ops
 * gracefully in Expo Go or if permissions are denied.
 */
export async function registerForPushNotifications() {
  console.log("[PushNotif] Starting registration...");

  if (!Device.isDevice) {
    console.log("[PushNotif] Skipped — not a physical device");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log("[PushNotif] Permission status:", existingStatus);
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log("[PushNotif] Requested permission, new status:", finalStatus);
  }

  if (finalStatus !== "granted") {
    console.log("[PushNotif] Permission denied — aborting");
    return;
  }

  let token: string | undefined;
  try {
    const result = await Notifications.getExpoPushTokenAsync({
      projectId: "a1e5c06d-26a5-4e05-89d9-3b9acf9a3ea4",
    });
    token = result.data;
    console.log("[PushNotif] Got Expo push token:", token);
  } catch (err) {
    console.log("[PushNotif] Could not get push token (Expo Go?):", err);
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
      console.log("[PushNotif] Token saved to backend, status:", res.status);
    } catch (err) {
      console.error("[PushNotif] Failed to save token to backend:", err);
    }
  } else {
    console.log("[PushNotif] Skipped backend save — authToken:", !!authToken, "token:", !!token);
  }
}
