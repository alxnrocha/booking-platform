export interface PriceBreakdown {
  nights: number;
  pricePerNight: number;
  baseTotal: number;
  cleaningFee: number;
  serviceFee: number;
  grandTotal: number;
}

export function calculateBookingPrice(
  pricePerNight: number,
  nights: number,
  cleaningFee: number = 75,
  serviceFeeRate: number = 0.1145
): PriceBreakdown {
  const safeNights = Math.max(1, nights);
  const baseTotal = pricePerNight * safeNights;
  const serviceFee = Math.round(baseTotal * serviceFeeRate);
  const grandTotal = baseTotal + cleaningFee + serviceFee;

  return {
    nights: safeNights,
    pricePerNight,
    baseTotal,
    cleaningFee,
    serviceFee,
    grandTotal,
  };
}
