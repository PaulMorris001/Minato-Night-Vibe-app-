import * as AppleAuthentication from "expo-apple-authentication";

/**
 * Sign in with Apple is only available on iOS 13+ devices. Android and older
 * iOS versions should hide the button entirely.
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
};

export interface AppleSignInResult {
  identityToken: string;
  /** Combined given + family name. Apple only sends this on FIRST sign-in. */
  fullName?: string;
  /** Apple only sends this on FIRST sign-in; may be a private relay address. */
  email?: string;
}

/**
 * Trigger the native Sign in with Apple flow and return the identity token
 * (a JWT the server verifies) plus the name/email Apple provides on first
 * authorization. Throws on failure; the caller should treat
 * `ERR_REQUEST_CANCELED` as a silent user cancellation.
 */
export const signInWithApple = async (): Promise<AppleSignInResult> => {
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
  });

  if (!credential.identityToken) {
    throw new Error("No identity token received from Apple");
  }

  const fullName = credential.fullName
    ? [credential.fullName.givenName, credential.fullName.familyName]
        .filter(Boolean)
        .join(" ")
        .trim()
    : undefined;

  return {
    identityToken: credential.identityToken,
    fullName: fullName || undefined,
    email: credential.email || undefined,
  };
};
