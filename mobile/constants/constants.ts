// import Constants from "expo-constants";

/**
 * Get the API base URL
 * Currently set to always use deployed Render backend for testing
 * To use local backend, uncomment the imports and local URL below
 */
const getBaseUrl = () => {
  // Check for explicit environment variable first
  const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }

  // Always use Render backend (for testing deployed backend)
  return "https://nightvibe-backend.onrender.com/api";

  // Uncomment below (and the import above) to use local backend during development:
  // let host = "localhost";
  // if (Constants.expoConfig?.hostUri) {
  //   host = Constants.expoConfig.hostUri.split(":")[0];
  // }
  // const port = process.env.EXPO_PUBLIC_API_PORT || "3000";
  // return `http://${host}:${port}/api`;
};

export const BASE_URL = getBaseUrl();

export const config = {
  apiUrl: BASE_URL,
  socketUrl: BASE_URL.replace("/api", ""),
  isProduction: process.env.NODE_ENV === 'production' || !__DEV__,
};
