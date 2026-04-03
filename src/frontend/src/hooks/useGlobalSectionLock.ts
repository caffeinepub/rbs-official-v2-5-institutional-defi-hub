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

/**
 * Normalize section key to camelCase before passing to backend.
 * The backend only accepts: "marketIntel", "developerBlog", "polls".
 */
function normalizeSection(s: string): string {
  if (s === "market_intel") return "marketIntel";
  if (s === "developer_blog") return "developerBlog";
  return s;
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

  const sectionKey = normalizeSection(section);

  const fetchLockState = useCallback(async () => {
    if (!actor) return;
    try {
      const state = await actor.getGlobalSectionLock(sectionKey);
      setIsUnlocked(state);
    } catch {
      // keep previous state on error
    } finally {
      setIsLoading(false);
    }
  }, [actor, sectionKey]);

  useEffect(() => {
    // If actor is not fetching and still null, stop loading — backend unreachable
    if (!actor && !isFetching) {
      setIsLoading(false);
      return;
    }
    if (!actor || isFetching) return;
    fetchLockState();
    const interval = setInterval(fetchLockState, 10000);
    return () => clearInterval(interval);
  }, [actor, isFetching, fetchLockState]);

  // Safety timeout: if loading hasn't resolved after 10s, unblock the UI
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 10000);
    return () => clearTimeout(t);
  }, []);

  const toggle = useCallback(
    async (passcode: string): Promise<boolean> => {
      if (!actor) throw new Error("System not ready — please refresh the page");
      try {
        const newState = await actor.toggleGlobalSectionLock(
          sectionKey,
          passcode,
        );
        setIsUnlocked(newState);
        return newState;
      } catch (err) {
        throw new Error(parseBackendError(err));
      }
    },
    [actor, sectionKey],
  );

  const setLock = useCallback(
    async (passcode: string, unlock: boolean): Promise<void> => {
      if (!actor) throw new Error("System not ready — please refresh the page");
      try {
        await actor.setGlobalSectionLock(sectionKey, passcode, unlock);
        setIsUnlocked(unlock);
      } catch (err) {
        throw new Error(parseBackendError(err));
      }
    },
    [actor, sectionKey],
  );

  return {
    isUnlocked,
    isLoading,
    toggle,
    setLock,
    refresh: fetchLockState,
  };
}
