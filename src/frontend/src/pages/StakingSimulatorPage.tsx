import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Award, BarChart3, Clock, Coins, TrendingUp, Zap } from "lucide-react";
import React from "react";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { STAKING_TIERS, useStakingRewards } from "../hooks/useStakingRewards";

export default function StakingSimulatorPage() {
  const {
    amount,
    setAmount,
    durationDays,
    setDurationDays,
    compoundFrequency,
    setCompoundFrequency,
    selectedTier,
    result,
  } = useStakingRewards();

  const fmt = (n: number) =>
    n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <PageHead
        title="Staking Simulator | RBS"
        description="Calculate your RBS staking rewards with compound interest"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => i).map((i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-amber-400/20 rounded-full animate-pulse"
              style={{
                left: `${(i * 37 + 13) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                animationDelay: `${(i * 0.3) % 3}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>

        {/* Hero */}
        <SmokySectionTransition>
          <div className="relative py-16 px-4 text-center border-b border-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-amber-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400">
                Staking Simulator
              </h1>
            </div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Calculate compound staking rewards with tier-based APY and
              multi-milestone projections
            </p>
          </div>
        </SmokySectionTransition>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8 relative z-10">
          {/* Input Panel */}
          <SmokySectionTransition>
            <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-amber-400 font-bold text-xl mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Configure Stake
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Amount */}
                <div>
                  <p className="text-gray-300 text-sm font-medium mb-3">
                    Stake Amount:{" "}
                    <span className="text-amber-400 font-bold">
                      {amount.toLocaleString()} RBS
                    </span>
                  </p>
                  <Slider
                    min={100}
                    max={1000000}
                    step={100}
                    value={[amount]}
                    onValueChange={([v]) => setAmount(v)}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>100 RBS</span>
                    <span>1,000,000 RBS</span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-gray-300 text-sm font-medium mb-3">
                    Duration:{" "}
                    <span className="text-amber-400 font-bold">
                      {durationDays} days
                    </span>
                  </p>
                  <Slider
                    min={30}
                    max={365}
                    step={1}
                    value={[durationDays]}
                    onValueChange={([v]) => setDurationDays(v)}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>30 days</span>
                    <span>365 days</span>
                  </div>
                  {/* Quick tier buttons */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {STAKING_TIERS.map((tier) => (
                      <button
                        key={tier.days}
                        type="button"
                        onClick={() => setDurationDays(tier.days)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          durationDays === tier.days
                            ? "bg-amber-500 text-black border-amber-500"
                            : "bg-gray-800 text-gray-400 border-gray-700 hover:border-amber-500/50"
                        }`}
                      >
                        {tier.days}d
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compounding Frequency */}
              <div className="mt-6">
                <p className="text-gray-300 text-sm font-medium mb-3">
                  Compounding Frequency
                </p>
                <RadioGroup
                  value={compoundFrequency}
                  onValueChange={(v) =>
                    setCompoundFrequency(v as "daily" | "monthly" | "annually")
                  }
                  className="flex gap-6"
                >
                  {(["daily", "monthly", "annually"] as const).map((freq) => (
                    <div key={freq} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={freq}
                        id={`freq-${freq}`}
                        className="border-amber-500 text-amber-500"
                      />
                      <Label
                        htmlFor={`freq-${freq}`}
                        className="text-gray-300 capitalize cursor-pointer"
                      >
                        {freq}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Selected Tier Info */}
              <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-amber-400 font-bold text-sm">
                    Active Tier
                  </p>
                  <p className="text-gray-300 text-xs mt-0.5">
                    {selectedTier.label}
                  </p>
                </div>
                <Badge className="bg-amber-500 text-black font-bold text-base px-4 py-1">
                  {selectedTier.apy}% APY
                </Badge>
              </div>
            </div>
          </SmokySectionTransition>

          {/* Gradient Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Results */}
          <SmokySectionTransition>
            <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <h2 className="text-amber-400 font-bold text-xl mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Projected Results
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    icon: <Coins className="w-5 h-5 text-amber-400" />,
                    label: "Principal",
                    value: `${fmt(result.principal)} RBS`,
                    color: "text-white",
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5 text-green-400" />,
                    label: "Total Reward",
                    value: `+${fmt(result.totalReward)} RBS`,
                    color: "text-green-400",
                  },
                  {
                    icon: <Award className="w-5 h-5 text-amber-400" />,
                    label: "Final Amount",
                    value: `${fmt(result.finalAmount)} RBS`,
                    color: "text-amber-400",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-blue-400" />,
                    label: "APY",
                    value: `${result.apy}%`,
                    color: "text-blue-400",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="bg-black/30 border border-gray-700/50 rounded-xl p-4 hover:border-amber-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className={`text-base font-bold ${item.color}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pool Share */}
              <div className="bg-black/30 border border-amber-500/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-300">
                      Pool Share
                    </span>
                  </div>
                  <span className="text-amber-400 font-bold">
                    {result.poolSharePct.toFixed(4)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(result.poolSharePct * 100, 100)}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Your stake represents {result.poolSharePct.toFixed(4)}% of the
                  total pool
                </p>
              </div>

              {/* Milestones Table */}
              <div>
                <h3 className="text-gray-300 font-semibold text-sm mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" /> Projection
                  Milestones
                </h3>
                <div className="rounded-xl overflow-hidden border border-gray-700/50">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700 bg-gray-800/50">
                        <TableHead className="text-gray-400 text-xs">
                          Milestone
                        </TableHead>
                        <TableHead className="text-gray-400 text-xs text-right">
                          Reward
                        </TableHead>
                        <TableHead className="text-gray-400 text-xs text-right">
                          Total Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.milestones.map((m) => (
                        <TableRow
                          key={m.days}
                          className={`border-gray-700/50 ${m.days === durationDays ? "bg-amber-500/10" : "bg-gray-900/30"}`}
                        >
                          <TableCell className="text-gray-300 text-sm font-medium">
                            {m.days} days
                            {m.days === durationDays && (
                              <Badge className="ml-2 bg-amber-500 text-black text-xs py-0">
                                Selected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-green-400 text-sm text-right font-mono">
                            +{fmt(m.reward)}
                          </TableCell>
                          <TableCell className="text-amber-400 text-sm text-right font-mono">
                            {fmt(m.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </SmokySectionTransition>

          {/* Info */}
          <SmokySectionTransition>
            <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-amber-400 font-bold text-base mb-4">
                📊 Staking Details
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  • Community Rewards Pool:{" "}
                  <span className="text-amber-400 font-semibold">
                    8,000 RBS
                  </span>{" "}
                  (8% of total supply)
                </li>
                <li>
                  • Tier APYs:{" "}
                  <span className="text-amber-400 font-semibold">
                    30d=8% · 90d=12% · 180d=15% · 365d=20%
                  </span>
                </li>
                <li>
                  • Compound interest formula:{" "}
                  <span className="text-amber-400 font-mono text-xs">
                    A = P × (1 + r/n)^(n×t)
                  </span>
                </li>
                <li>• Compounding options: Daily, Monthly, or Annually</li>
                <li>• Staking launch date: TBD (pending presale completion)</li>
              </ul>
            </div>
          </SmokySectionTransition>
        </div>
      </div>
    </>
  );
}
