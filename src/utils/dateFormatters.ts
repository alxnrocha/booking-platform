const monthShortNames = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatDateRange(checkIn: string | null, checkOut: string | null): string {
  if (!checkIn && !checkOut) return 'Add dates';
  if (checkIn && !checkOut) {
    const parts = checkIn.split('-');
    if (parts.length === 3) {
      const month = monthShortNames[parseInt(parts[1], 10) - 1] || parts[1];
      const day = parseInt(parts[2], 10);
      return `${month} ${day}`;
    }
    return checkIn;
  }

  if (checkIn && checkOut) {
    const inParts = checkIn.split('-');
    const outParts = checkOut.split('-');

    if (inParts.length === 3 && outParts.length === 3) {
      const inMonth = monthShortNames[parseInt(inParts[1], 10) - 1] || inParts[1];
      const inDay = parseInt(inParts[2], 10);
      const outMonth = monthShortNames[parseInt(outParts[1], 10) - 1] || outParts[1];
      const outDay = parseInt(outParts[2], 10);

      if (inMonth === outMonth) {
        return `${inMonth} ${inDay} – ${outDay}`;
      }
      return `${inMonth} ${inDay} – ${outMonth} ${outDay}`;
    }

    return `${checkIn} – ${checkOut}`;
  }

  return 'Add dates';
}
