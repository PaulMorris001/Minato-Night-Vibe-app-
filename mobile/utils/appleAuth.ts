import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

import { remoteLog } from "@/utils/remoteLog";

/**
 * Sign in with Apple is only available on iOS 13+ devices. Android and older
 * iOS versions should hide the button entirely.
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  try {
    const available = await AppleAuthentication.isAvailableAsync();
    remoteLog("info", "apple.isAvailable", { platform: Platform.OS, available });
    return available;
  } catch (err: any) {
    // isAvailableAsync throwing is unexpected (native module problem) but not
    // user-visible, so log to Render and report false.
    remoteLog(
      "warn",
      "apple.isAvailable threw",
      { platform: Platform.OS, message: err?.message },
      err
    );
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
 *
 * Apple error codes worth knowing when reading Render logs:
 *   ERR_REQUEST_CANCELED        — user dismissed the sheet (silent, expected)
 *   ERR_REQUEST_FAILED          — Apple's server couldn't process the request
 *                                 (network blip, or a misconfigured Service ID /
 *                                 bundle id on the Apple Developer side)
 *   ERR_REQUEST_NOT_HANDLED     — the entitlement is missing from the binary
 *                                 (Sign in with Apple capability not enabled)
 *   ERR_REQUEST_NOT_INTERACTIVE — sheet couldn't be presented (rare; usually
 *                                 a presentation-context issue)
 *   ERR_REQUEST_INVALID_RESPONSE — Apple returned a malformed credential
 *   ERR_REQUEST_UNKNOWN         — catch-all from Apple
 */
export const signInWithApple = async (): Promise<AppleSignInResult> => {
  const startedAt = Date.now();
  remoteLog("info", "apple.signIn start", { platform: Platform.OS });

  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
  } catch (err: any) {
    // Apple signInAsync errors are environment/user issues — Render logs the
    // code; the SocialAuthButtons handler shows the user a friendly message.
    // No Sentry here (it's not a crash).
    remoteLog(
      err?.code === "ERR_REQUEST_CANCELED" ? "info" : "warn",
      "apple.signIn threw",
      {
        platform: Platform.OS,
        code: err?.code,
        name: err?.name,
        message: err?.message,
        elapsedMs: Date.now() - startedAt,
      },
      err
    );
    throw err;
  }

  remoteLog("info", "apple.signIn resolved", {
    platform: Platform.OS,
    hasIdentityToken: !!credential.identityToken,
    identityTokenLen: credential.identityToken?.length || 0,
    hasEmail: !!credential.email,
    hasFullName: !!credential.fullName,
    user: credential.user, // Apple's stable user id (safe to log)
    realUserStatus: credential.realUserStatus,
    elapsedMs: Date.now() - startedAt,
  });

  if (!credential.identityToken) {
    remoteLog("error", "apple.signIn returned no identity token", {
      platform: Platform.OS,
    });
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
