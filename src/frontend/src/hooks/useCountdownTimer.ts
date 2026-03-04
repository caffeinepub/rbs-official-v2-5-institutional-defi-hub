import { useEffect, useRef, useState } from "react";

export interface CountdownDisplay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  displayTime: string;
  isUnlocked: boolean;
  totalSecondsLeft: number;
}

// Roadmap dates (nanoseconds as bigint)
const PRESALE_END_NS = BigInt("1806724799000000000"); // March 31, 2027
const AIRDROP_END_NS = BigInt("1869796799000000000"); // March 31, 2029

function nsToMs(ns: bigint): number {
  return Number(ns / BigInt(1_000_000));
}

function formatCountdown(msLeft: number): CountdownDisplay {
  const totalSeconds = Math.max(0, Math.floor(msLeft / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const isUnlocked = totalSeconds <= 0;
  const displayTime = isUnlocked
    ? "UNLOCKED"
    : `${String(days).padStart(2, "0")}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;
  return {
    days,
    hours,
    minutes,
    seconds,
    displayTime,
    isUnlocked,
    totalSecondsLeft: totalSeconds,
  };
}

export function useCountdownTimer(
  timerType: "presale" | "airdrop",
  onUnlock?: () => void,
): CountdownDisplay {
  const endNs = timerType === "presale" ? PRESALE_END_NS : AIRDROP_END_NS;
  const endMs = nsToMs(endNs);

  const [countdown, setCountdown] = useState<CountdownDisplay>(() => {
    const msLeft = endMs - Date.now();
    return formatCountdown(msLeft);
  });

  const onUnlockRef = useRef(onUnlock);
  onUnlockRef.current = onUnlock;
  const hasUnlockedRef = useRef(false);

  useEffect(() => {
    const tick = () => {
      const msLeft = endMs - Date.now();
      const cd = formatCountdown(msLeft);
      setCountdown(cd);
      if (cd.isUnlocked && !hasUnlockedRef.current) {
        hasUnlockedRef.current = true;
        onUnlockRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endMs]);

  return countdown;
}
