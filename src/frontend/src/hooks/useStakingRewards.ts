import { useMemo, useState } from "react";

export type CompoundFrequency = "daily" | "monthly" | "annually";

export interface StakingTier {
  days: number;
  apy: number;
  label: string;
}

export const STAKING_TIERS: StakingTier[] = [
  { days: 30, apy: 8, label: "30 Days — 8% APY" },
  { days: 90, apy: 12, label: "90 Days — 12% APY" },
  { days: 180, apy: 15, label: "180 Days — 15% APY" },
  { days: 365, apy: 20, label: "365 Days — 20% APY" },
];

export interface ProjectionMilestone {
  days: number;
  reward: number;
  total: number;
}

export interface StakingResult {
  principal: number;
  apy: number;
  durationDays: number;
  compoundFrequency: CompoundFrequency;
  finalAmount: number;
  totalReward: number;
  poolSharePct: number;
  milestones: ProjectionMilestone[];
}

const TOTAL_POOL_SIZE = 10_000_000; // 10M RBS total pool

function compoundInterest(
  principal: number,
  apy: number,
  durationDays: number,
  frequency: CompoundFrequency,
): number {
  const r = apy / 100;
  const n = frequency === "daily" ? 365 : frequency === "monthly" ? 12 : 1;
  const t = durationDays / 365;
  return principal * (1 + r / n) ** (n * t);
}

export function useStakingRewards() {
  const [amount, setAmount] = useState<number>(1000);
  const [durationDays, setDurationDays] = useState<number>(90);
  const [compoundFrequency, setCompoundFrequency] =
    useState<CompoundFrequency>("daily");

  const selectedTier = useMemo(() => {
    const sorted = [...STAKING_TIERS].sort((a, b) => a.days - b.days);
    let tier = sorted[0];
    for (const t of sorted) {
      if (durationDays >= t.days) tier = t;
    }
    return tier;
  }, [durationDays]);

  const result = useMemo((): StakingResult => {
    const apy = selectedTier.apy;
    const finalAmount = compoundInterest(
      amount,
      apy,
      durationDays,
      compoundFrequency,
    );
    const totalReward = finalAmount - amount;
    const poolSharePct = amount > 0 ? (amount / TOTAL_POOL_SIZE) * 100 : 0;

    const milestones: ProjectionMilestone[] = [30, 90, 180, 365].map((days) => {
      const d = Math.min(days, durationDays);
      const total = compoundInterest(amount, apy, d, compoundFrequency);
      return { days, reward: total - amount, total };
    });

    return {
      principal: amount,
      apy,
      durationDays,
      compoundFrequency,
      finalAmount,
      totalReward,
      poolSharePct,
      milestones,
    };
  }, [amount, durationDays, compoundFrequency, selectedTier]);

  return {
    amount,
    setAmount,
    durationDays,
    setDurationDays,
    compoundFrequency,
    setCompoundFrequency,
    selectedTier,
    result,
  };
}
