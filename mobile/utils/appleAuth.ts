import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";

/**
 * Sign in with Apple is only available on iOS 13+ devices. Android and older
 * iOS versions should hide the button entirely.
 */
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  try {
    const available = await AppleAuthentication.isAvailableAsync();
    console.log("[appleAuth] isAvailableAsync", { platform: Platform.OS, available });
    Sentry.addBreadcrumb({
      category: "auth.apple",
      message: "isAvailableAsync",
      level: "info",
      data: { platform: Platform.OS, available },
    });
    return available;
  } catch (err: any) {
    console.warn("[appleAuth] isAvailableAsync threw", err?.message);
    Sentry.captureException(err, {
      tags: { action: "apple.isAvailable", platform: Platform.OS },
    });
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
 * Apple's error codes worth knowing when reading Sentry breadcrumbs:
 *   ERR_REQUEST_CANCELED      — user dismissed the sheet (silent, expected)
 *   ERR_REQUEST_FAILED        — Apple's server couldn't process the request
 *                               (network blip, or a misconfigured Service ID /
 *                                bundle id on the Apple Developer side)
 *   ERR_REQUEST_NOT_HANDLED   — the entitlement is missing from the binary
 *                               (Sign in with Apple capability not enabled)
 *   ERR_REQUEST_NOT_INTERACTIVE — sheet couldn't be presented (rare; usually
 *                                 a presentation-context issue)
 *   ERR_REQUEST_INVALID_RESPONSE — Apple returned a malformed credential
 *   ERR_REQUEST_UNKNOWN       — catch-all from Apple
 */
export const signInWithApple = async (): Promise<AppleSignInResult> => {
  const startedAt = Date.now();
  console.log("[appleAuth] signInWithApple: start");
  Sentry.addBreadcrumb({
    category: "auth.apple",
    message: "signInWithApple: start",
    level: "info",
    data: { platform: Platform.OS },
  });

  let credential: AppleAuthentication.AppleAuthenticationCredential;
  try {
    credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
  } catch (err: any) {
    const data = {
      platform: Platform.OS,
      code: err?.code,
      name: err?.name,
      message: err?.message,
      domain: err?.domain,
      elapsedMs: Date.now() - startedAt,
    };
    console.warn("[appleAuth] signInAsync threw", data);
    Sentry.addBreadcrumb({
      category: "auth.apple",
      message: "signInAsync threw",
      level: "error",
      data,
    });
    // Only capture non-cancellation errors so Sentry doesn't fill up with
    // benign user dismissals.
    if (err?.code !== "ERR_REQUEST_CANCELED") {
      Sentry.captureException(err, {
        tags: { action: "apple.signIn", platform: Platform.OS, code: err?.code },
        contexts: { apple: data },
      });
    }
    throw err;
  }

  const data = {
    platform: Platform.OS,
    hasIdentityToken: !!credential.identityToken,
    identityTokenLen: credential.identityToken?.length || 0,
    hasEmail: !!credential.email,
    hasFullName: !!credential.fullName,
    user: credential.user, // Apple's stable user id (safe to log)
    realUserStatus: credential.realUserStatus,
    elapsedMs: Date.now() - startedAt,
  };
  console.log("[appleAuth] signInAsync resolved", data);
  Sentry.addBreadcrumb({
    category: "auth.apple",
    message: "signInAsync resolved",
    level: "info",
    data,
  });

  if (!credential.identityToken) {
    Sentry.captureMessage("Apple returned no identity token", {
      level: "error",
      tags: { action: "apple.signIn.noToken", platform: Platform.OS },
      contexts: { apple: data },
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
