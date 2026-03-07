import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

export function useGlobalSectionLock(
  section: "marketIntel" | "developerBlog" | "polls",
) {
  const { actor, isFetching } = useActor();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLockState = useCallback(async () => {
    if (!actor) return;
    try {
      const state = await actor.getGlobalSectionLock(section);
      setIsUnlocked(state);
    } catch {
      // keep previous state on error
    } finally {
      setIsLoading(false);
    }
  }, [actor, section]);

  useEffect(() => {
    if (!actor || isFetching) return;
    fetchLockState();
    const interval = setInterval(fetchLockState, 10000);
    return () => clearInterval(interval);
  }, [actor, isFetching, fetchLockState]);

  const toggle = useCallback(
    async (passcode: string): Promise<boolean> => {
      if (!actor) throw new Error("System not ready");
      const newState = await actor.toggleGlobalSectionLock(section, passcode);
      setIsUnlocked(newState);
      return newState;
    },
    [actor, section],
  );

  const setLock = useCallback(
    async (passcode: string, unlock: boolean): Promise<void> => {
      if (!actor) throw new Error("System not ready");
      await actor.setGlobalSectionLock(section, passcode, unlock);
      setIsUnlocked(unlock);
    },
    [actor, section],
  );

  return {
    isUnlocked,
    isLoading,
    toggle,
    setLock,
    refresh: fetchLockState,
  };
}
