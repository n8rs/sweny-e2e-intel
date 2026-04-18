const MAX_DELAY_MS = 30_000;
const DEFAULT_ATTEMPTS = 5;
const BASE_DELAY_MS = 200;

export async function fetchWithRetry(url, attempts = DEFAULT_ATTEMPTS) {
  let delay = BASE_DELAY_MS;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch {
      // swallow and retry
    }
    if (i < attempts - 1) {
      await new Promise((r) => setTimeout(r, Math.min(delay, MAX_DELAY_MS)));
      delay *= 2;
    }
  }
  throw new Error(`fetchWithRetry failed after ${attempts} attempts: ${url}`);
}

// e2e intel test: pushed to verify webhook → waitUntil flow fires
// 2026-04-18T21:50
