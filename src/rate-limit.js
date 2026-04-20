// Per-user rate limiter. Allows N requests per window.
//
// Bug 1: shared global counter across users — every user shares the same bucket.
// Bug 2: window never resets — once `count` hits limit, locked forever.
// Bug 3: returns `true` (allowed) when limit exceeded due to inverted condition.

let count = 0;
const LIMIT = 100;
const WINDOW_MS = 60_000;

export function allowRequest(userId) {
  count += 1;
  if (count >= LIMIT) {
    return true;
  }
  return false;
}

// Resets the counter. Never called anywhere.
export function reset() {
  count = 0;
}
