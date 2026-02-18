import { useCheckMarketIntelAccess } from './useQueries';

export function useAdvancedAnalytics() {
  const { data: hasMarketIntelAccess, isLoading: accessLoading } = useCheckMarketIntelAccess();

  const isLoading = accessLoading;

  const dataCoverage = {
    livePrice: false,
    aiSentiment: false,
    marketIntel: !!hasMarketIntelAccess,
  };

  return {
    priceSnapshot: null,
    sentiment: null,
    hasMarketIntelAccess,
    dataCoverage,
    isLoading,
  };
}
