import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "./useInternetIdentity";

/**
 * Reliable authentication wrapper that prevents race conditions and handles
 * the "User is already authenticated" error gracefully.
 */
export function useReliableAuth() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const queryClient = useQueryClient();
  const [isAuthInFlight, setIsAuthInFlight] = useState(false);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loginAttemptRef = useRef(false);

  const isAuthenticated = !!identity;

  // Clear auth in-flight state when identity changes
  useEffect(() => {
    if (identity && loginAttemptRef.current) {
      loginAttemptRef.current = false;
      setIsAuthInFlight(false);
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
    }
  }, [identity]);

  const handleLogin = useCallback(async () => {
    // Prevent concurrent login attempts
    if (
      isAuthInFlight ||
      loginStatus === "logging-in" ||
      loginAttemptRef.current
    ) {
      return;
    }

    // If already authenticated, don't try to login again
    if (identity) {
      return;
    }

    loginAttemptRef.current = true;
    setIsAuthInFlight(true);

    // Safety timeout
    authTimeoutRef.current = setTimeout(() => {
      loginAttemptRef.current = false;
      setIsAuthInFlight(false);
    }, 30000);

    try {
      await login();

      // Wait for identity to settle
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Invalidate all queries to refresh with new identity
      queryClient.invalidateQueries();
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle the "already authenticated" edge case
      if (error.message?.includes("already authenticated")) {
        try {
          // Clear existing session
          await clear();
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Retry login
          await login();
          await new Promise((resolve) => setTimeout(resolve, 800));
          queryClient.invalidateQueries();
        } catch (retryError) {
          console.error("Login retry failed:", retryError);
          loginAttemptRef.current = false;
          setIsAuthInFlight(false);
          throw retryError;
        }
      } else {
        loginAttemptRef.current = false;
        setIsAuthInFlight(false);
        throw error;
      }
    } finally {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
    }
  }, [login, clear, queryClient, isAuthInFlight, loginStatus, identity]);

  const handleLogout = useCallback(async () => {
    if (isAuthInFlight) {
      return;
    }

    setIsAuthInFlight(true);

    // Safety timeout
    authTimeoutRef.current = setTimeout(() => {
      setIsAuthInFlight(false);
    }, 10000);

    try {
      // Cancel all in-flight queries
      queryClient.cancelQueries();

      // Clear the session
      await clear();

      // Wait for identity to clear
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clear all cached data
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
      setIsAuthInFlight(false);
    }
  }, [clear, queryClient, isAuthInFlight]);

  const handleAuth = useCallback(async () => {
    if (isAuthenticated) {
      await handleLogout();
    } else {
      await handleLogin();
    }
  }, [isAuthenticated, handleLogin, handleLogout]);

  return {
    handleAuth,
    handleLogin,
    handleLogout,
    isAuthenticated,
    identity,
    loginStatus,
    isInitializing,
    isAuthInFlight,
    isDisabled:
      isAuthInFlight || loginStatus === "logging-in" || isInitializing,
  };
}
