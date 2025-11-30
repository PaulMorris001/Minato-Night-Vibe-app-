import Constants from "expo-constants";

/**
 * Get the API base URL
 * - In production: Use EXPO_PUBLIC_API_URL environment variable
 * - In development: Auto-detect using Expo's hostUri
 */
const getBaseUrl = () => {
  // Check for explicit environment variable first (production)
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }

  // Development: auto-detect local network IP
  let host = "localhost";
  if (Constants.expoConfig?.hostUri) {
    host = Constants.expoConfig.hostUri.split(":")[0];
  }

  const port = process.env.EXPO_PUBLIC_API_PORT || "3000";
  return `http://${host}:${port}/api`;
};

export const BASE_URL = getBaseUrl();

export const config = {
  apiUrl: BASE_URL,
  socketUrl: BASE_URL.replace("/api", ""),
};
