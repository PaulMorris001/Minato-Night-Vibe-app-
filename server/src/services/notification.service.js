import Expo from "expo-server-sdk";

const expo = new Expo();

/**
 * Send a push notification to a single Expo push token.
 * Silently no-ops if the token is missing or invalid.
 */
export async function sendPushNotification(pushToken, title, body, data = {}) {
  console.log(`[Push] Attempting to send: "${title}" → token: ${pushToken?.slice(0, 30)}...`);

  if (!pushToken) {
    console.log("[Push] Skipped — no push token");
    return;
  }
  if (!Expo.isExpoPushToken(pushToken)) {
    console.log("[Push] Skipped — invalid Expo push token:", pushToken);
    return;
  }

  const message = {
    to: pushToken,
    title,
    body,
    data,
    sound: "default",
  };

  try {
    const [ticket] = await expo.sendPushNotificationsAsync([message]);
    if (ticket.status === "error") {
      console.error("[Push] Ticket error:", ticket.message, ticket.details);
    } else {
      console.log("[Push] Sent successfully, ticket id:", ticket.id);
    }
  } catch (err) {
    console.error("[Push] Send error:", err);
  }
}
