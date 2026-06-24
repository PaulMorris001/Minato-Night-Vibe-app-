import Toast from "react-native-toast-message";

export const showSuccess = (msg: string, title?: string) =>
  Toast.show({ type: "success", text1: title ?? "Success", text2: msg, visibilityTime: 3000 });

export const showError = (msg: string, title?: string) =>
  Toast.show({ type: "error", text1: title ?? "Error", text2: msg, visibilityTime: 4000 });

export const showInfo = (msg: string, title?: string) =>
  Toast.show({ type: "info", text1: title ?? "Info", text2: msg, visibilityTime: 3000 });
