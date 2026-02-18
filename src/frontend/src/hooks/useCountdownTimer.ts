import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { formatCountdown, nanosToSeconds, type CountdownTime } from '@/utils/timers';

const RESYNC_INTERVAL = 60000; // Resync with backend every minute

export function usePresaleCountdown() {
  const { actor, isFetching: actorFetching } = useActor();
  const [localCountdown, setLocalCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false,
  });

  // Fetch remaining time from backend
  const { data: backendRemaining } = useQuery({
    queryKey: ['presaleTimer'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPresaleRemainingTime();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: RESYNC_INTERVAL,
    staleTime: 30000,
  });

  useEffect(() => {
    if (backendRemaining === undefined) return;

    // Convert backend time immediately and set state
    let remainingSeconds = nanosToSeconds(backendRemaining);
    const initialCountdown = formatCountdown(remainingSeconds);
    setLocalCountdown(initialCountdown);

    // Don't start interval if already at 0
    if (remainingSeconds <= 0) {
      return;
    }

    // Start local countdown interval
    const interval = setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      const newCountdown = formatCountdown(remainingSeconds);
      setLocalCountdown(newCountdown);

      // Clear interval when we hit 0
      if (remainingSeconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [backendRemaining]);

  return localCountdown;
}

export function useAirdropCountdown() {
  const { actor, isFetching: actorFetching } = useActor();
  const [localCountdown, setLocalCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false,
  });

  // Fetch remaining time from backend
  const { data: backendRemaining } = useQuery({
    queryKey: ['airdropTimer'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAirdropRemainingTime();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: RESYNC_INTERVAL,
    staleTime: 30000,
  });

  useEffect(() => {
    if (backendRemaining === undefined) return;

    // Convert backend time immediately and set state
    let remainingSeconds = nanosToSeconds(backendRemaining);
    const initialCountdown = formatCountdown(remainingSeconds);
    setLocalCountdown(initialCountdown);

    // Don't start interval if already at 0
    if (remainingSeconds <= 0) {
      return;
    }

    // Start local countdown interval
    const interval = setInterval(() => {
      remainingSeconds = Math.max(0, remainingSeconds - 1);
      const newCountdown = formatCountdown(remainingSeconds);
      setLocalCountdown(newCountdown);

      // Clear interval when we hit 0
      if (remainingSeconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [backendRemaining]);

  return localCountdown;
}
