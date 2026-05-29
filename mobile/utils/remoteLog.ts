import { Platform } from "react-native";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
 * Offline buffering:
 *   - If the POST fails (network down, server unreachable, captive portal),
 *     the line is appended to an AsyncStorage queue.
 *   - Next time *any* remoteLog call succeeds, the queue is drained ahead of
 *     the new line so older events arrive in order.
 *   - Queue is capped at MAX_BUFFERED entries — once full, the OLDEST get
 *     dropped. We'd rather have recent context than stale data.
 *   - Each buffered entry keeps its ORIGINAL timestamp so the server prints
 *     when the event actually happened, not when it was finally flushed.
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
 * server is down. Worst case the line is lost (queue full + offline).
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

const BUFFER_KEY = "@nightvibe_remote_log_buffer";
const MAX_BUFFERED = 50;
// Don't hammer the network with flushes; cap how many queued lines we send
// per real call so a 50-deep backlog doesn't fan out into 50 parallel POSTs.
const FLUSH_BATCH = 10;
const POST_TIMEOUT_MS = 8_000;

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
  return stack.split("\n").slice(0, 6).join("\n");
}

// Serialize the AsyncStorage read/write so two concurrent remoteLog calls can't
// race and overwrite each other's buffer additions.
let bufferLock: Promise<void> = Promise.resolve();
function withBuffer<T>(fn: (buf: LogPayload[]) => Promise<T> | T): Promise<T> {
  const run = async () => {
    const raw = await AsyncStorage.getItem(BUFFER_KEY).catch(() => null);
    let buf: LogPayload[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) buf = parsed;
      } catch {
        // Corrupt buffer — drop it and start fresh.
      }
    }
    const result = await fn(buf);
    try {
      await AsyncStorage.setItem(BUFFER_KEY, JSON.stringify(buf));
    } catch {
      // Storage full or otherwise unwriteable — give up on persistence this
      // round; next call will retry.
    }
    return result;
  };
  const next = bufferLock.then(run, run);
  // Don't let one failure poison the chain forever.
  bufferLock = next.then(
    () => undefined,
    () => undefined
  );
  return next;
}

async function postOne(payload: LogPayload): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

// Try to flush up to FLUSH_BATCH old entries. Stops on first failure so we
// don't blow the backlog on a still-down backend.
async function flushBuffer(): Promise<void> {
  await withBuffer(async (buf) => {
    let drained = 0;
    while (buf.length > 0 && drained < FLUSH_BATCH) {
      const head = buf[0];
      const ok = await postOne(head);
      if (!ok) return;
      buf.shift();
      drained += 1;
    }
  });
}

async function enqueue(payload: LogPayload): Promise<void> {
  await withBuffer((buf) => {
    buf.push(payload);
    // Drop oldest if we overflow.
    while (buf.length > MAX_BUFFERED) buf.shift();
  });
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

  // In dev, also mirror to the local console for immediate visibility.
  if (__DEV__) {
    const fn =
      level === "error"
        ? console.error
        : level === "warn"
        ? console.warn
        : console.log;
    fn(`[remoteLog ${level}] ${message}`, context ?? "");
  }

  (async () => {
    try {
      // First, try to drain anything stuck in the buffer so events are
      // delivered in order. Bounded by FLUSH_BATCH per call.
      await flushBuffer();
      const ok = await postOne(payload);
      if (!ok) {
        await enqueue(payload);
      }
    } catch {
      // Last-ditch — never throw out of remoteLog.
      try {
        await enqueue(payload);
      } catch {
        // Genuinely nothing we can do.
      }
    }
  })();
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
