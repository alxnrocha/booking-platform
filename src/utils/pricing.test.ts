import { describe, it, expect } from 'vitest';
import { calculateBookingPrice } from './pricing.ts';

describe('calculateBookingPrice', () => {
  it('calculates total for 3 nights at 320 EUR correctly with standard fees', () => {
    const result = calculateBookingPrice(320, 3, 75, 0.1145);
    expect(result.baseTotal).toBe(960);
    expect(result.cleaningFee).toBe(75);
    expect(result.serviceFee).toBe(110);
    expect(result.grandTotal).toBe(1145);
  });

  it('guarantees at least 1 night when calculating prices', () => {
    const result = calculateBookingPrice(200, 0, 50, 0.1);
    expect(result.nights).toBe(1);
    expect(result.baseTotal).toBe(200);
    expect(result.serviceFee).toBe(20);
    expect(result.grandTotal).toBe(270);
  });
});
