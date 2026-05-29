import { Platform } from "react-native";
import Constants from "expo-constants";

import { BASE_URL } from "@/constants/constants";

/**
 * Fire-and-forget logger that posts a single line to the backend's
 * `POST /api/logs` endpoint. The server prints it to stdout, which Render
 * captures in its log stream — so a `remoteLog("info", "google.web.success")`
 * call on a phone shows up alongside HTTP access logs in Render moments later.
 *
 * Why this exists:
 *   - Production iOS/Android builds strip `console.log` (babel.config.js drops
 *     it via `transform-remove-console`), so the only way to see runtime
 *     diagnostics from a real user's device is to send them somewhere.
 *   - We want Sentry reserved for genuine crashes and unexpected exceptions.
 *     Breadcrumbs / `captureMessage` / forwarded console.warn are noise that
 *     burns the Sentry quota and buries the real errors.
 *
 * Rules of thumb for callers:
 *   - `info`  — start/finish of a flow, status updates ("got token", "navigating
 *               home"), telemetry. Most logs are info.
 *   - `warn`  — recoverable problems the user might notice (server returned
 *               4xx, expected fallback path taken).
 *   - `error` — something we didn't expect and the user sees a failure
 *               message. Often paired with a `throw`. Use sparingly; if it's
 *               truly a crash, `Sentry.captureException` is the right tool.
 *
 * Never blocks. Never throws. Never crashes the app if the network or the
 * server is down. Worst case the line is lost.
 */

type LogLevel = "info" | "warn" | "error";

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: any;
  stack?: string;
  deviceInfo: {
    platform: string;
    osVersion: string;
    appVersion: string;
  };
}

// Cache device info — Platform.OS is a constant and we read it on every call.
let cachedDeviceInfo: LogPayload["deviceInfo"] | null = null;
function getDeviceInfo(): LogPayload["deviceInfo"] {
  if (cachedDeviceInfo) return cachedDeviceInfo;
  cachedDeviceInfo = {
    platform: Platform.OS,
    osVersion: String(Platform.Version ?? ""),
    appVersion: Constants.expoConfig?.version ?? "unknown",
  };
  return cachedDeviceInfo;
}

function shortStack(err: unknown): string | undefined {
  if (!err) return undefined;
  if (typeof err === "string") return err;
  const stack = (err as any)?.stack;
  if (typeof stack !== "string") return undefined;
  // Server prints the whole thing — keep it short-ish so a single line doesn't
  // dominate the log stream.
  return stack.split("\n").slice(0, 6).join("\n");
}

/**
 * Send a single log line to the server. Fire-and-forget.
 *
 * @param level    "info" | "warn" | "error"
 * @param message  Short human-readable identifier ("google.web.success"). Keep
 *                 it dot-namespaced and stable so grepping Render works.
 * @param context  Optional object of extra structured fields. Avoid huge
 *                 payloads — server logs them as JSON and they balloon fast.
 * @param error    Optional Error/unknown — its stack is pulled out and sent.
 */
export function remoteLog(
  level: LogLevel,
  message: string,
  context?: Record<string, any>,
  error?: unknown
): void {
  const payload: LogPayload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    stack: shortStack(error),
    deviceInfo: getDeviceInfo(),
  };

  // In dev, also mirror to the local console for immediate visibility. The
  // babel plugin doesn't strip these because __DEV__ is true.
  if (__DEV__) {
    const fn =
      level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
    fn(`[remoteLog ${level}] ${message}`, context ?? "");
  }

  try {
    // Note: no Authorization header — /api/logs accepts anonymous posts so we
    // can capture pre-login flows (Google sign-in, signup, etc.). The server
    // already handles a missing user.
    fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Network errors here are expected (no internet, server down). Swallow
      // them — this is best-effort telemetry.
    });
  } catch {
    // JSON.stringify on a circular `context` would land here. Don't recurse
    // back into remoteLog from inside remoteLog.
  }
}

// Convenience wrappers so callers can write `log.info("…")` instead of
// `remoteLog("info", "…")` if they prefer.
export const log = {
  info: (message: string, context?: Record<string, any>) =>
    remoteLog("info", message, context),
  warn: (message: string, context?: Record<string, any>, error?: unknown) =>
    remoteLog("warn", message, context, error),
  error: (message: string, context?: Record<string, any>, error?: unknown) =>
    remoteLog("error", message, context, error),
};
