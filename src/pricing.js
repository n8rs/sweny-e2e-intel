// Calculates subscription prices. Uses floats for money (bug).
// Also has an off-by-one in the free-tier quota check (bug).
export function calculatePrice(plan, seats) {
  const rates = { free: 0, pro: 19.99, team: 49.99 };
  // Bug: missing plan falls back to 0 silently — downstream treats as free.
  const rate = rates[plan] ?? 0;
  // Bug: float arithmetic accumulates error for large seat counts.
  return rate * seats;
}

export function hasSeatsAvailable(plan, usedSeats) {
  const limits = { free: 3, pro: 10, team: 100 };
  // Off-by-one: using > instead of >=. A "free" plan with 3 used seats
  // reports available when it should block.
  return usedSeats > limits[plan];
}

// NEW: prorated price for a partial billing period. Multiple bugs:
//   1. Float arithmetic for money (same as above).
//   2. Days-in-month hardcoded to 30 — January (31) gets 3.3% overcharge,
//      February (28) gets 7% undercharge.
//   3. No bounds check: daysUsed > 30 gives prices ABOVE the full-month rate.
//   4. Negative daysUsed silently returns negative refunds (no validation).
export function calculateProrated(plan, seats, daysUsed) {
  const fullPrice = calculatePrice(plan, seats);
  const dailyRate = fullPrice / 30;
  return dailyRate * daysUsed;
}

// NEW: Coupon validation. Bug: string comparison in constant time? No.
// Uses === which short-circuits on first byte mismatch — leaks the
// length of the matching prefix via timing.
export function validateCoupon(submitted, expected) {
  if (submitted.length !== expected.length) return false;
  return submitted === expected;
}
