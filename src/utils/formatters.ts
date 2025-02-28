/**
 * Formats a number with appropriate units and decimal places
 * @param value Number to format
 * @param decimals Number of decimal places (default: 1)
 * @returns Formatted string
 */
export function formatNumber(value: number, decimals: number = 1): string {
  if (value === 0) return '0';

  if (value < 0.01) {
    return value.toExponential(decimals);
  }

  if (value < 1) {
    return value.toFixed(2);
  }

  if (value < 1000) {
    return value.toFixed(decimals);
  }

  const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

  // Calculate the appropriate unit index
  const unitIndex = Math.floor(Math.log10(value) / 3);
  const unitValue = value / Math.pow(1000, unitIndex);

  const cappedUnitIndex = Math.min(unitIndex, units.length - 1);

  return `${unitValue.toFixed(decimals)}${units[cappedUnitIndex]}`;
}

/**
 * Formats time in seconds to a readable string
 * @param seconds Time in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`;
  }

  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days}d ${hours}h`;
}

/**
 * Formats a percentage value
 * @param value Decimal value (0-1)
 * @param decimals Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimals: number = 0): string {
  const percentage = value * 100;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * Formats a timestamp to a readable date/time string
 * @param timestamp The timestamp to format (milliseconds since epoch)
 * @returns Formatted date/time string
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp);

  // Format: HH:MM:SS
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}
