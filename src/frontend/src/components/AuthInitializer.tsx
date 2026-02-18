import { useEffect, useRef } from 'react';
import { useActor } from '@/hooks/useActor';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Non-visual component that ensures backend initialization happens
 * once after successful authentication and coordinates query timing.
 */
export function AuthInitializer() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const initializationAttempted = useRef(false);
  const lastIdentityRef = useRef<string | null>(null);

  useEffect(() => {
    const currentIdentity = identity?.getPrincipal().toString() || null;
    
    // Reset initialization flag when identity changes
    if (currentIdentity !== lastIdentityRef.current) {
      initializationAttempted.current = false;
      lastIdentityRef.current = currentIdentity;
    }

    // Only proceed if we have an authenticated actor and haven't initialized yet
    if (!actor || actorFetching || !identity || initializationAttempted.current) {
      return;
    }

    const initializeBackend = async () => {
      try {
        initializationAttempted.current = true;
        
        // Call backend initialize (will only succeed for admin on first call)
        await actor.initialize();
        
        // Wait a moment for backend state to settle
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Invalidate queries to fetch fresh data with initialized backend
        queryClient.invalidateQueries();
      } catch (error: any) {
        // "Already initialized" is expected and not an error
        if (error.message?.includes('Already initialized')) {
          // Still invalidate queries to ensure fresh data
          queryClient.invalidateQueries();
        } else if (error.message?.includes('Unauthorized')) {
          // Non-admin users will get unauthorized, which is fine
          // Just invalidate queries to load their data
          queryClient.invalidateQueries();
        } else {
          console.error('Backend initialization error:', error);
        }
      }
    };

    initializeBackend();
  }, [actor, actorFetching, identity, queryClient]);

  // This component renders nothing
  return null;
}
