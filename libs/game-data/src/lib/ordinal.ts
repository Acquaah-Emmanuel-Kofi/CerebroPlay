export function ordinal(n: number): string {
  const lastTwoDigits = n % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return `${n}th`;
  }

  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}
