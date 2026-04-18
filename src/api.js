const MAX_DELAY_MS = 30_000;

export async function fetchWithRetry(url, attempts = 5) {
  let delay = 200;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return res;
    } catch {
      // swallow and retry
    }
    await new Promise((r) => setTimeout(r, Math.min(delay, MAX_DELAY_MS)));
    delay *= 2;
  }
  throw new Error(`fetchWithRetry failed after ${attempts} attempts: ${url}`);
}
