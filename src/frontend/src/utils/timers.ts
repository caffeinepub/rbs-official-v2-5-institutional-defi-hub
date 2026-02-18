/**
 * Timer utility functions for countdown display
 * Converts backend remaining time (bigint nanoseconds) to stable UI-friendly format
 */

export interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isUnlocked: boolean;
}

/**
 * Convert bigint nanoseconds to seconds, clamped at 0
 */
export function nanosToSeconds(nanos: bigint): number {
  const seconds = Number(nanos / BigInt(1_000_000_000));
  return Math.max(0, seconds);
}

/**
 * Format remaining seconds into countdown parts
 * Returns stable time parts for UI rendering with fixed-width support
 */
export function formatCountdown(remainingSeconds: number): CountdownTime {
  const safeSeconds = Math.max(0, Math.floor(remainingSeconds));
  
  if (safeSeconds === 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isUnlocked: true,
    };
  }

  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isUnlocked: false,
  };
}

/**
 * Format time part with leading zero for stable display
 */
export function padTime(value: number): string {
  return value.toString().padStart(2, '0');
}
