import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";

import { BASE_URL } from "@/constants/constants";
import { remoteLog } from "@/utils/remoteLog";

/**
 * Backend reachability check fired once on app launch.
 *
 * The point isn't to keep the server warm (we're on Render Starter — it's
 * always on). It's to:
 *
 *   1. Detect when a user's network can't reach our backend AT ALL (Private
 *      Relay weirdness, ISP filtering, captive portal, dead WiFi), separately
 *      from per-request flakes. If `/health` fails after 3 staggered attempts,
 *      we know the user's environment is broken before they even tap login.
 *   2. Emit ONE Sentry event in that case — this is exactly the "major error"
 *      category that belongs in Sentry. If we start seeing these for a
 *      cluster of users (region, ISP, app version), we know to investigate
 *      DNS / certs / Cloudflare / etc.
 *   3. Surface a single in-app indicator the rest of the app can read so
 *      screens can decide whether to show a "Connection trouble" banner
 *      instead of silently spinning.
 *
 * Uses raw `fetch` instead of the axios interceptor stack on purpose — we
 * want to measure raw reachability without our own retry logic in the way.
 */

export type Reachability = "unknown" | "ok" | "unreachable";

let currentState: Reachability = "unknown";
const listeners = new Set<(s: Reachability) => void>();

export function getReachability(): Reachability {
  return currentState;
}

export function onReachabilityChange(cb: (s: Reachability) => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function setState(next: Reachability) {
  if (currentState === next) return;
  currentState = next;
  for (const cb of listeners) {
    try {
      cb(next);
    } catch {
      // ignore listener errors
    }
  }
}

const HEALTH_URL = `${BASE_URL.replace(/\/api\/?$/, "")}/health`;
const ATTEMPT_TIMEOUT_MS = 8_000;
const ATTEMPT_DELAYS_MS = [0, 2_000, 5_000]; // 3 attempts total

async function pingOnce(timeoutMs: number): Promise<{ ok: boolean; status?: number; message?: string; elapsedMs: number }> {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(HEALTH_URL, {
      method: "GET",
      signal: controller.signal,
    });
    return { ok: res.ok, status: res.status, elapsedMs: Date.now() - startedAt };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || String(err),
      elapsedMs: Date.now() - startedAt,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fire-and-forget. Call once from `_layout.tsx` on app launch. The function
 * does its own backoff; don't await it from the UI path or you'll block the
 * first paint behind 3 staggered network calls.
 */
export function checkBackendReachable(): void {
  (async () => {
    let lastError: { status?: number; message?: string; elapsedMs?: number } = {};
    for (let i = 0; i < ATTEMPT_DELAYS_MS.length; i++) {
      if (ATTEMPT_DELAYS_MS[i] > 0) {
        await new Promise((r) => setTimeout(r, ATTEMPT_DELAYS_MS[i]));
      }
      const result = await pingOnce(ATTEMPT_TIMEOUT_MS);
      remoteLog("info", "reachability.ping", {
        attempt: i + 1,
        url: HEALTH_URL,
        ok: result.ok,
        status: result.status,
        message: result.message,
        elapsedMs: result.elapsedMs,
      });
      if (result.ok) {
        setState("ok");
        return;
      }
      lastError = result;
    }

    // All 3 attempts failed → the backend is unreachable from this device.
    // This IS a major user-facing failure (no part of the app will work), so
    // it earns one Sentry capture, tagged so we can aggregate by app version /
    // platform / OS to spot patterns.
    setState("unreachable");
    Sentry.captureMessage("Backend unreachable from device", {
      level: "error",
      tags: {
        action: "reachability.unreachable",
        platform: Platform.OS,
        osVersion: String(Platform.Version ?? ""),
      },
      contexts: {
        reachability: {
          url: HEALTH_URL,
          attempts: ATTEMPT_DELAYS_MS.length,
          lastStatus: lastError.status,
          lastMessage: lastError.message,
          lastElapsedMs: lastError.elapsedMs,
        },
      },
    });
    // Also log to Render in case ONE of the subsequent calls in the app
    // happens to get through — gives us a paper trail there too.
    remoteLog("error", "reachability.unreachable", {
      url: HEALTH_URL,
      lastStatus: lastError.status,
      lastMessage: lastError.message,
      lastElapsedMs: lastError.elapsedMs,
    });
  })();
}
