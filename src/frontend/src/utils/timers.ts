/**
 * Shared timer utilities for converting backend-provided remaining time (bigint)
 * into stable UI-safe values for consistent lock/unlock behavior across forms.
 */

export interface TimerData {
  remainingMs: number;
  remainingSeconds: number;
  isLocked: boolean;
  formattedTime: string;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/**
 * Converts backend bigint nanoseconds to milliseconds safely
 */
export function nanosToMs(nanos: bigint): number {
  return Number(nanos / 1_000_000n);
}

/**
 * Formats remaining time into a human-readable string
 */
export function formatRemainingTime(remainingMs: number): string {
  if (remainingMs <= 0) return 'Unlocked';
  
  const seconds = Math.floor(remainingMs / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Processes backend timer data into UI-safe timer state
 */
export function processTimerData(backendTime: bigint | undefined): TimerData {
  if (backendTime === undefined) {
    return {
      remainingMs: 0,
      remainingSeconds: 0,
      isLocked: false,
      formattedTime: 'Loading...',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const remainingMs = nanosToMs(backendTime);
  const remainingSeconds = Math.floor(remainingMs / 1000);
  const isLocked = remainingMs > 0;
  
  const days = Math.floor(remainingSeconds / 86400);
  const hours = Math.floor((remainingSeconds % 86400) / 3600);
  const minutes = Math.floor((remainingSeconds % 3600) / 60);
  const seconds = remainingSeconds % 60;

  return {
    remainingMs,
    remainingSeconds,
    isLocked,
    formattedTime: formatRemainingTime(remainingMs),
    days,
    hours,
    minutes,
    seconds,
  };
}
