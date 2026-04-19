// Calculates subscription prices. Refactor: use cents (int) to fix float bug.
export function calculatePrice(plan, seats) {
  const ratesInCents = { free: 0, pro: 1999, team: 4999 };
  if (!(plan in ratesInCents)) {
    throw new Error(`unknown plan: ${plan}`);
  }
  const rate = ratesInCents[plan];
  return (rate * seats) / 100;
}

export function hasSeatsAvailable(plan, usedSeats) {
  const limits = { free: 3, pro: 10, team: 100 };
  if (!(plan in limits)) {
    throw new Error(`unknown plan: ${plan}`);
  }
  // Fix off-by-one: usedSeats >= limit means at-or-over quota → not available.
  return usedSeats < limits[plan];
}
