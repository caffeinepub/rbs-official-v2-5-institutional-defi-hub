import { useEffect, useState } from "react";
import { useActor } from "./useActor";

/**
 * Polls the backend for total registered user count.
 * Updates every 30 seconds. Falls back to 0 if backend is unavailable.
 */
export function useAccountCount() {
  const { actor } = useActor();
  const [count, setCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!actor) return;

    const fetchCount = async () => {
      try {
        const result = await actor.getTotalUserCount();
        setCount(Number(result));
        setIsLoaded(true);
      } catch {
        // Silently fail — keep previous count
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30_000);
    return () => clearInterval(interval);
  }, [actor]);

  return { count, isLoaded };
}
