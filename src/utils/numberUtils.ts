/**
 * Formats a number with appropriate suffixes for large values
 * e.g. 1,500 becomes 1.5K, 2,400,000 becomes 2.4M
 *
 * @param value The number to format
 * @param precision Number of decimal places (default: 1)
 * @returns Formatted string representation of the number
 */
export function formatNumber(value: number, precision: number = 1): string {
  // Handle zero or undefined values
  if (value === 0 || !value) return '0';

  // Handle negative numbers
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);

  // Define suffixes for different number ranges
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

  // Determine which suffix to use
  const tier = (Math.log10(absValue) / 3) | 0;

  // If less than 1000, just return the number
  if (tier === 0) return sign + absValue.toFixed(precision > 0 ? precision : 0);

  // Extract the scale factor and suffix
  const suffix = suffixes[tier] || 'e' + tier * 3;
  const scale = absValue / Math.pow(10, tier * 3);

  // Format the number with proper precision and add the suffix
  return sign + scale.toFixed(precision) + suffix;
}

/**
 * Formats a percentage value
 *
 * @param value The number to format as a percentage (0-1)
 * @param precision Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, precision: number = 0): string {
  return (value * 100).toFixed(precision) + '%';
}

/**
 * Parses a formatted number string back into a number
 * e.g. "1.5K" becomes 1500, "2.4M" becomes 2400000
 *
 * @param formatted The formatted string to parse
 * @returns The parsed number value
 */
export function parseFormattedNumber(formatted: string): number {
  // Remove any commas
  const clean = formatted.replace(/,/g, '');

  // Extract the suffix
  const matchResult = clean.match(/^-?\d+(\.\d+)?([A-Za-z]+)?$/);
  if (!matchResult) return 0;

  const [, , suffix] = matchResult;

  if (!suffix) {
    return parseFloat(clean);
  }

  // Define multiplier for each suffix
  const suffixes: Record<string, number> = {
    K: 1e3,
    M: 1e6,
    B: 1e9,
    T: 1e12,
    Qa: 1e15,
    Qi: 1e18,
    Sx: 1e21,
    Sp: 1e24,
    Oc: 1e27,
    No: 1e30,
    Dc: 1e33,
  };

  const multiplier = suffixes[suffix] || 1;
  const numPart = parseFloat(clean.replace(suffix, ''));

  return numPart * multiplier;
}
