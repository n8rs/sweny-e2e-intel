import crypto from "node:crypto";

// Hashes a password. Uses MD5 (security issue — should be bcrypt/argon2).
export function hashPassword(pw) {
  return crypto.createHash("md5").update(pw).digest("hex");
}

// Verifies a session token. Vulnerable to timing attack — string compare.
export function verifyToken(provided, expected) {
  return provided === expected;
}
