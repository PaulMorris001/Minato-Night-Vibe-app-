import { remoteLog } from "./remoteLog";

/**
 * Global JS error handling. Sentry's React Native SDK is initialized in
 * `app/_layout.tsx`, where it auto-installs handlers for:
 *   - unhandled JS exceptions
 *   - unhandled promise rejections
 *   - native crashes (iOS/Android)
 *   - the React error boundary (via the `ErrorBoundary` component)
 *
 * Those are the "major errors/crashes" we WANT in Sentry. Everything else
 * (console.warn lines, recoverable errors, status logs) goes to Render via
 * `remoteLog`.
 */
export const setupGlobalErrorHandler = () => {
  // Nothing extra to wire — Sentry.init() in _layout.tsx already attaches
  // global error/promise-rejection handlers. Left as a hook for future use.
};

/**
 * Forward console.error and console.warn to Render (via `remoteLog`) in
 * production builds, so we can see them in the server log stream.
 *
 * Why not Sentry? console.warn is used very liberally throughout RN and the
 * libraries we depend on — forwarding every one to Sentry buries real errors
 * in noise and burns the quota. Render's free log stream is the right place
 * for those.
 *
 * Genuine crashes still reach Sentry through its global handlers; this only
 * affects calls that came through `console.error` / `console.warn`.
 */
export const setupConsoleOverride = () => {
  if (__DEV__) return; // dev keeps the native console behavior

  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: any[]) => {
    const message = stringifyFirstArg(args);
    const err = args[1] instanceof Error ? args[1] : undefined;
    remoteLog(
      "error",
      message,
      { args: args.map((a) => safeString(a)) },
      err
    );
    originalError(...args);
  };

  console.warn = (...args: any[]) => {
    const message = stringifyFirstArg(args);
    remoteLog("warn", message, { args: args.map((a) => safeString(a)) });
    originalWarn(...args);
  };
};

function stringifyFirstArg(args: any[]): string {
  const first = args[0];
  if (typeof first === "string") return first.slice(0, 200);
  if (first instanceof Error) return first.message.slice(0, 200);
  return safeString(first).slice(0, 200);
}

function safeString(v: any): string {
  try {
    if (v == null) return String(v);
    if (typeof v === "string") return v;
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (v instanceof Error) return `${v.name}: ${v.message}`;
    return JSON.stringify(v);
  } catch {
    return "[unserializable]";
  }
}
