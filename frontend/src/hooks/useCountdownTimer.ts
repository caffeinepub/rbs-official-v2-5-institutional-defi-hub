import { useState, useEffect, useRef } from 'react';
import { useActor } from './useActor';
import { TimerType } from '../backend';

export interface CountdownDisplay {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  totalSeconds: number;
  unlocked: boolean;
  isLoading: boolean;
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0');
}

export function useCountdownTimer(timerType: 'presale' | 'airdrop'): CountdownDisplay {
  const { actor, isFetching: actorFetching } = useActor();
  const [endTimeMs, setEndTimeMs] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [remaining, setRemaining] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!actor || actorFetching || fetchedRef.current) return;
    fetchedRef.current = true;

    const type = timerType === 'presale' ? TimerType.presale : TimerType.airdrop;

    actor.getTimerState(type).then((state) => {
      const endNs = Number(state.endTime);
      // endTime is in nanoseconds; convert to milliseconds
      const endMs = endNs / 1_000_000;
      setEndTimeMs(endMs);
      setIsUnlocked(state.isUnlocked);
      const nowMs = Date.now();
      const diffMs = endMs - nowMs;
      setRemaining(Math.max(0, Math.floor(diffMs / 1000)));
      setIsLoading(false);
    }).catch(() => {
      // Fallback: use hardcoded roadmap timestamps
      const fallbackMs = timerType === 'presale'
        ? 1_789_434_800_000  // presaleEndTime in ms
        : 2_252_772_800;     // airdropEndTime in ms (already small, treat as ms)
      setEndTimeMs(fallbackMs);
      const nowMs = Date.now();
      const diffMs = fallbackMs - nowMs;
      setRemaining(Math.max(0, Math.floor(diffMs / 1000)));
      setIsLoading(false);
    });
  }, [actor, actorFetching, timerType]);

  useEffect(() => {
    if (isLoading || endTimeMs === null) return;

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const nowMs = Date.now();
      const diffMs = endTimeMs - nowMs;
      const secs = Math.max(0, Math.floor(diffMs / 1000));
      setRemaining(secs);
      if (secs <= 0) {
        setIsUnlocked(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [endTimeMs, isLoading]);

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return {
    days: pad(days),
    hours: pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
    totalSeconds: remaining,
    unlocked: isUnlocked || remaining <= 0,
    isLoading,
  };
}
