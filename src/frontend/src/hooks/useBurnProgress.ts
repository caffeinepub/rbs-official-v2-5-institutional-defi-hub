import { useMemo } from "react";

const BURN_TARGET = 15_000; // 15% of 100,000 RBS

export interface BurnEvent {
  date: string;
  amount: number;
  txHash: string;
  description: string;
}

export interface BurnProgress {
  burned: number;
  target: number;
  remaining: number;
  percentage: number;
  history: BurnEvent[];
}

const MOCK_BURN_HISTORY: BurnEvent[] = [
  {
    date: "2025-01-15",
    amount: 1000,
    txHash: "0xabc...001",
    description: "Initial burn event",
  },
  {
    date: "2025-03-20",
    amount: 1500,
    txHash: "0xabc...002",
    description: "Q1 2025 burn",
  },
  {
    date: "2025-06-10",
    amount: 1200,
    txHash: "0xabc...003",
    description: "Q2 2025 burn",
  },
  {
    date: "2025-09-05",
    amount: 800,
    txHash: "0xabc...004",
    description: "Q3 2025 burn",
  },
  {
    date: "2025-12-01",
    amount: 500,
    txHash: "0xabc...005",
    description: "Q4 2025 burn",
  },
];

const TOTAL_BURNED = MOCK_BURN_HISTORY.reduce((sum, e) => sum + e.amount, 0);

export function useBurnProgress(): BurnProgress {
  return useMemo(() => {
    const burned = TOTAL_BURNED;
    const remaining = Math.max(0, BURN_TARGET - burned);
    const percentage = Math.round((burned / BURN_TARGET) * 100);
    return {
      burned,
      target: BURN_TARGET,
      remaining,
      percentage,
      history: MOCK_BURN_HISTORY,
    };
  }, []);
}
