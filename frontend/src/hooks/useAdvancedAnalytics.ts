import { useHasMarketIntelAccess } from './useQueries';

export function useAdvancedAnalytics() {
  const accessQuery = useHasMarketIntelAccess();

  return {
    hasAccess: accessQuery.data ?? false,
    isLoading: accessQuery.isLoading,
  };
}
