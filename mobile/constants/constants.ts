import Constants from "expo-constants";

const getBaseUrl = () => {
  let host = "localhost";

  if (Constants.expoConfig?.hostUri) {
    host = Constants.expoConfig.hostUri.split(":")[0];
  }

  return `http://${host}:3000/api`;
};

export const BASE_URL = getBaseUrl();
