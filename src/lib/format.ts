/** Formats a numeric metric value with appropriate precision. */
export function formatValue(v: number, unit: string): string {
  const abs = Math.abs(v);
  let digits = 1;
  if (abs >= 100) digits = 0;
  else if (abs < 1) digits = 2;
  return `${v.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })} ${unit}`.trim();
}
