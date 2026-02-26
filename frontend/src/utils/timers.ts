export function formatTimerDisplay(nanoseconds: bigint): {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
} {
  // Convert nanoseconds to milliseconds
  const totalMs = Number(nanoseconds / BigInt(1_000_000));
  
  // Ensure non-negative
  const ms = Math.max(0, totalMs);
  
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Use tabular-nums for consistent width
  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}
