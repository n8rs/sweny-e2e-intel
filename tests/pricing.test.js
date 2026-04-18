import test from "node:test";
import assert from "node:assert/strict";
import { calculatePrice, hasSeatsAvailable } from "../src/pricing.js";

test("free plan costs zero", () => {
  assert.equal(calculatePrice("free", 5), 0);
});

test("pro plan scales with seats", () => {
  assert.equal(calculatePrice("pro", 2), 39.98);
});
