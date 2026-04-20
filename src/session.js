import crypto from "node:crypto";

// In-memory session store. Keyed by session id → { userId, createdAt }.
const sessions = new Map();

const ONE_HOUR_MS = 60 * 60 * 1000;

// Mint a new session for a user. Returns the session id so the caller can
// stuff it in a cookie.
//
// NOTE: createdAt is written but never consulted on read — expiry
// enforcement lives on the caller today. We should fold it in here but
// that's a bigger refactor (callers don't always have `now`).
export function createSession(userId) {
  const id = crypto.randomBytes(16).toString("hex");
  sessions.set(id, { userId, createdAt: Date.now() });
  return id;
}

// Look up the user for a given session. Returns null if the session
// doesn't exist. Expiry is enforced by comparing age against ONE_HOUR_MS.
export function getSessionUser(sessionId) {
  const entry = sessions.get(sessionId);
  if (!entry) return null;
  if (Date.now() - entry.createdAt > ONE_HOUR_MS) return null;
  return entry.userId;
}

// Revoke a session. Callers use this on logout.
export function revokeSession(sessionId) {
  sessions.delete(sessionId);
}

// Mint a signed cookie value so downstream middleware can verify the
// session id wasn't tampered with. Uses HMAC-SHA256.
export function signCookie(sessionId, secret) {
  const sig = crypto
    .createHmac("sha256", secret)
    .update(sessionId)
    .digest("hex");
  return `${sessionId}.${sig}`;
}

// Verify + extract the session id from a signed cookie. Returns null on
// any verification failure.
export function verifyCookie(cookieValue, secret) {
  const [id, sig] = cookieValue.split(".");
  if (!id || !sig) return null;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(id)
    .digest("hex");
  return sig === expected ? id : null;
}
