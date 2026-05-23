import { config } from "../config/env.js";

/**
 * Proxy for the Country-State-City API (countrystatecity.in).
 *
 * The CSC API key is secret and must never reach the mobile client, so all
 * location lookups funnel through here. Responses are cached in memory because
 * the underlying data is effectively static — this keeps us well within the
 * free-tier request quota.
 */

const TTL_MS = 24 * 60 * 60 * 1000; // 24h — countries/states/cities rarely change
const cache = new Map(); // key -> { expires, data }

function getCached(key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.data;
  if (hit) cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, { expires: Date.now() + TTL_MS, data });
}

async function cscFetch(path) {
  if (!config.csc.apiKey) {
    const err = new Error("Location service is not configured");
    err.statusCode = 503;
    throw err;
  }
  const res = await fetch(`${config.csc.baseUrl}${path}`, {
    headers: { "X-CSCAPI-KEY": config.csc.apiKey },
  });
  if (!res.ok) {
    const err = new Error(`CSC API error (${res.status})`);
    err.statusCode = res.status === 429 ? 429 : 502;
    throw err;
  }
  return res.json();
}

function handleError(res, error, fallback) {
  console.error("Location proxy error:", error?.message || error);
  const status = error?.statusCode || 500;
  res.status(status).json({ message: error?.statusCode ? error.message : fallback });
}

// GET /locations/countries
export async function getCountries(req, res) {
  try {
    const key = "countries";
    let data = getCached(key);
    if (!data) {
      const raw = await cscFetch("/countries");
      data = raw.map((c) => ({ name: c.name, iso2: c.iso2 }));
      setCached(key, data);
    }
    res.status(200).json({ countries: data });
  } catch (error) {
    handleError(res, error, "Failed to fetch countries");
  }
}

// GET /locations/countries/:ciso/states
export async function getStates(req, res) {
  try {
    const { ciso } = req.params;
    const key = `states:${ciso}`;
    let data = getCached(key);
    if (!data) {
      const raw = await cscFetch(`/countries/${encodeURIComponent(ciso)}/states`);
      data = raw
        .map((s) => ({ name: s.name, iso2: s.iso2 }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setCached(key, data);
    }
    res.status(200).json({ states: data });
  } catch (error) {
    handleError(res, error, "Failed to fetch states");
  }
}

// GET /locations/countries/:ciso/states/:siso/cities
export async function getCities(req, res) {
  try {
    const { ciso, siso } = req.params;
    const key = `cities:${ciso}:${siso}`;
    let data = getCached(key);
    if (!data) {
      const raw = await cscFetch(
        `/countries/${encodeURIComponent(ciso)}/states/${encodeURIComponent(siso)}/cities`
      );
      data = raw
        .map((c) => ({ name: c.name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setCached(key, data);
    }
    res.status(200).json({ cities: data });
  } catch (error) {
    handleError(res, error, "Failed to fetch cities");
  }
}
