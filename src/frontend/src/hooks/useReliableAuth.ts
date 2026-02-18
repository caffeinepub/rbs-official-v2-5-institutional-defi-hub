import { useState, useCallback, useRef } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Reliable authentication wrapper that prevents race conditions and handles
 * the "User is already authenticated" error gracefully.
 */
export function useReliableAuth() {
  const { login, clear, loginStatus, identity, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isAuthInFlight, setIsAuthInFlight] = useState(false);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = !!identity;

  const handleLogin = useCallback(async () => {
    if (isAuthInFlight || loginStatus === 'logging-in') {
      return;
    }

    setIsAuthInFlight(true);

    // Safety timeout
    authTimeoutRef.current = setTimeout(() => {
      setIsAuthInFlight(false);
    }, 30000);

    try {
      await login();
      
      // Wait a moment for identity to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Invalidate all queries to refresh with new identity
      queryClient.invalidateQueries();
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle the "already authenticated" edge case
      if (error.message?.includes('already authenticated')) {
        try {
          await clear();
          await new Promise(resolve => setTimeout(resolve, 500));
          await login();
          await new Promise(resolve => setTimeout(resolve, 500));
          queryClient.invalidateQueries();
        } catch (retryError) {
          console.error('Login retry failed:', retryError);
          throw retryError;
        }
      } else {
        throw error;
      }
    } finally {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
        authTimeoutRef.current = null;
      }
      setIsAuthInFlight(false);
    }
  }, [login, clear, queryClient, isAuthInFlight, loginStatus]);

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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Clear all cached data
      queryClient.clear();
    } catch (error) {
      console.error('Logout error:', error);
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
    isDisabled: isAuthInFlight || loginStatus === 'logging-in' || isInitializing,
  };
}
