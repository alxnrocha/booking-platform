import { describe, it, expect } from 'vitest';
import { calculateBookingPrice } from './pricing.ts';

describe('calculateBookingPrice', () => {
  it('calculates total for 3 nights at 320 EUR correctly with standard fees', () => {
    const result = calculateBookingPrice(320, 3, 75, 0.1145);
    expect(result.nights).toBe(3);
    expect(result.baseTotal).toBe(960);
    expect(result.cleaningFee).toBe(75);
    expect(result.serviceFee).toBe(110);
    expect(result.grandTotal).toBe(1145);
  });

  it('guarantees at least 1 night when calculating prices for 0 or negative inputs', () => {
    const result = calculateBookingPrice(200, 0, 50, 0.1);
    expect(result.nights).toBe(1);
    expect(result.baseTotal).toBe(200);
    expect(result.serviceFee).toBe(20);
    expect(result.grandTotal).toBe(270);
  });

  it('calculates pricing for high-end luxury stays correctly (e.g. 7 nights at 830 EUR in Tulum)', () => {
    const result = calculateBookingPrice(830, 7, 140, 0.1145);
    expect(result.nights).toBe(7);
    expect(result.baseTotal).toBe(5810);
    expect(result.cleaningFee).toBe(140);
    expect(result.serviceFee).toBe(665); // Math.round(5810 * 0.1145) = 665
    expect(result.grandTotal).toBe(6615);
  });

  it('handles default optional parameters seamlessly', () => {
    const result = calculateBookingPrice(300, 2);
    expect(result.nights).toBe(2);
    expect(result.baseTotal).toBe(600);
    expect(result.cleaningFee).toBe(75); // default cleaning fee
    expect(result.serviceFee).toBe(69); // Math.round(600 * 0.1145) = 69
    expect(result.grandTotal).toBe(744);
  });
});
