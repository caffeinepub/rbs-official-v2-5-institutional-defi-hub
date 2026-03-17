import { useCallback, useEffect, useState } from "react";
import { useActor } from "./useActor";

function parseBackendError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);
  // Motoko trap messages come back wrapped in rejection strings
  const lower = raw.toLowerCase();
  if (
    lower.includes("unauthorized") ||
    lower.includes("invalid passcode") ||
    lower.includes("wrong passcode") ||
    lower.includes("passcode required") ||
    lower.includes("invalid market intel") ||
    lower.includes("valid market intel") ||
    lower.includes("invalid code")
  ) {
    return "Wrong passcode — please try again";
  }
  if (lower.includes("not found") || lower.includes("unknown section")) {
    return "Section not found";
  }
  if (lower.includes("not authenticated") || lower.includes("anonymous")) {
    return "Please log in first";
  }
  return raw || "Operation failed. Please try again.";
}

export function useGlobalSectionLock(
  section:
    | "marketIntel"
    | "market_intel"
    | "developerBlog"
    | "developer_blog"
    | "polls"
    | string,
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
      try {
        const newState = await actor.toggleGlobalSectionLock(section, passcode);
        setIsUnlocked(newState);
        return newState;
      } catch (err) {
        throw new Error(parseBackendError(err));
      }
    },
    [actor, section],
  );

  const setLock = useCallback(
    async (passcode: string, unlock: boolean): Promise<void> => {
      if (!actor) throw new Error("System not ready");
      try {
        await actor.setGlobalSectionLock(section, passcode, unlock);
        setIsUnlocked(unlock);
      } catch (err) {
        throw new Error(parseBackendError(err));
      }
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
