import { useCallback, useMemo, useState } from "react";

export interface LivePriceData {
  symbol: string;
  price: number;
  change24h: number;
  marketCap?: number;
  volume24h?: number;
}

const ASSETS = ["BTC", "ETH", "BNB", "SOL", "XRP"];

export function usePortfolioTracker(livePriceData: LivePriceData[]) {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(ASSETS.map((a) => [a, 0])),
  );

  const setAssetQuantity = useCallback((symbol: string, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [symbol]: Math.max(0, quantity) }));
  }, []);

  const priceMap = useMemo(() => {
    const map: Record<string, LivePriceData> = {};
    for (const d of livePriceData) {
      map[d.symbol] = d;
    }
    return map;
  }, [livePriceData]);

  const getAssetValue = useCallback(
    (symbol: string) => {
      const qty = quantities[symbol] || 0;
      const price = priceMap[symbol]?.price || 0;
      return qty * price;
    },
    [quantities, priceMap],
  );

  const getTotalValue = useCallback(() => {
    return ASSETS.reduce((sum, sym) => sum + getAssetValue(sym), 0);
  }, [getAssetValue]);

  const get24hPnL = useCallback(() => {
    return ASSETS.reduce((sum, sym) => {
      const qty = quantities[sym] || 0;
      const data = priceMap[sym];
      if (!data || !data.price) return sum;
      const currentValue = qty * data.price;
      const prevPrice = data.price / (1 + data.change24h / 100);
      const prevValue = qty * prevPrice;
      return sum + (currentValue - prevValue);
    }, 0);
  }, [quantities, priceMap]);

  const get24hPnLPercentage = useCallback(() => {
    const pnl = get24hPnL();
    const prevTotal = ASSETS.reduce((sum, sym) => {
      const qty = quantities[sym] || 0;
      const data = priceMap[sym];
      if (!data || !data.price) return sum;
      const prevPrice = data.price / (1 + data.change24h / 100);
      return sum + qty * prevPrice;
    }, 0);
    if (prevTotal === 0) return 0;
    return (pnl / prevTotal) * 100;
  }, [get24hPnL, quantities, priceMap]);

  const getAllocationData = useCallback(() => {
    const total = getTotalValue();
    if (total === 0)
      return ASSETS.map((sym) => ({ symbol: sym, value: 0, percentage: 0 }));
    return ASSETS.map((sym) => {
      const value = getAssetValue(sym);
      return { symbol: sym, value, percentage: (value / total) * 100 };
    });
  }, [getTotalValue, getAssetValue]);

  return {
    quantities,
    setAssetQuantity,
    getAssetValue,
    getTotalValue,
    get24hPnL,
    get24hPnLPercentage,
    getAllocationData,
    assets: ASSETS,
  };
}
