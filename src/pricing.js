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
