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
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <SmokySectionTransition>
          <div
            className="py-16 px-4 text-center border-b border-gray-100 bg-white pt-20"
            style={{
              background: "linear-gradient(135deg, #f0f9ff 0%, #ffffff 60%)",
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Coins className="w-7 h-7 text-emerald-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Staking Simulator
              </h1>
            </div>
            <p className="text-gray-500 max-w-xl mx-auto text-lg">
              Calculate compound staking rewards with tier-based APY and
              multi-milestone projections
            </p>
          </div>
        </SmokySectionTransition>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
          {/* Input Panel */}
          <SmokySectionTransition>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-gray-900 font-bold text-xl mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" /> Configure Stake
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Amount */}
                <div>
                  <p
                    className="text-gray-600 text-sm font-medium mb-3"
                    data-ocid="staking.amount.label"
                  >
                    Stake Amount:{" "}
                    <span className="text-emerald-600 font-bold">
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
                    data-ocid="staking.amount.input"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>100 RBS</span>
                    <span>1,000,000 RBS</span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-3">
                    Duration:{" "}
                    <span className="text-emerald-600 font-bold">
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
                    data-ocid="staking.duration.input"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
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
                        data-ocid="staking.tier.button"
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                          durationDays === tier.days
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
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
                <p className="text-gray-600 text-sm font-medium mb-3">
                  Compounding Frequency
                </p>
                <RadioGroup
                  value={compoundFrequency}
                  onValueChange={(v) =>
                    setCompoundFrequency(v as "daily" | "monthly" | "annually")
                  }
                  className="flex gap-6"
                  data-ocid="staking.frequency.radio"
                >
                  {(["daily", "monthly", "annually"] as const).map((freq) => (
                    <div key={freq} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={freq}
                        id={`freq-${freq}`}
                        className="border-emerald-400 text-emerald-600"
                      />
                      <Label
                        htmlFor={`freq-${freq}`}
                        className="text-gray-600 capitalize cursor-pointer"
                      >
                        {freq}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Selected Tier Info */}
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-emerald-700 font-bold text-sm">
                    Active Tier
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {selectedTier.label}
                  </p>
                </div>
                <Badge className="bg-emerald-600 text-white font-bold text-base px-4 py-1">
                  {selectedTier.apy}% APY
                </Badge>
              </div>
            </div>
          </SmokySectionTransition>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />

          {/* Results */}
          <SmokySectionTransition>
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-gray-900 font-bold text-xl mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" /> Projected
                Results
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  {
                    icon: <Coins className="w-5 h-5 text-emerald-600" />,
                    label: "Principal",
                    value: `${fmt(result.principal)} RBS`,
                    color: "text-gray-900",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: <TrendingUp className="w-5 h-5 text-green-600" />,
                    label: "Total Reward",
                    value: `+${fmt(result.totalReward)} RBS`,
                    color: "text-green-600",
                    bg: "bg-green-50",
                  },
                  {
                    icon: <Award className="w-5 h-5 text-emerald-600" />,
                    label: "Final Amount",
                    value: `${fmt(result.finalAmount)} RBS`,
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                  },
                  {
                    icon: <Clock className="w-5 h-5 text-blue-600" />,
                    label: "APY",
                    value: `${result.apy}%`,
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`${item.bg} border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-all duration-300`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.icon}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p
                      className={`text-base font-bold font-jetbrains ${item.color}`}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Pool Share */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      Pool Share
                    </span>
                  </div>
                  <span className="text-emerald-600 font-bold">
                    {result.poolSharePct.toFixed(4)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(result.poolSharePct * 100, 100)}
                  className="h-2"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Your stake represents {result.poolSharePct.toFixed(4)}% of the
                  total pool
                </p>
              </div>

              {/* Milestones Table */}
              <div>
                <h3 className="text-gray-700 font-semibold text-sm mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" /> Projection
                  Milestones
                </h3>
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Table data-ocid="staking.milestones.table">
                    <TableHeader>
                      <TableRow className="border-gray-200 bg-gray-50">
                        <TableHead className="text-gray-500 text-xs">
                          Milestone
                        </TableHead>
                        <TableHead className="text-gray-500 text-xs text-right">
                          Reward
                        </TableHead>
                        <TableHead className="text-gray-500 text-xs text-right">
                          Total Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.milestones.map((m) => (
                        <TableRow
                          key={m.days}
                          className={`border-gray-100 ${m.days === durationDays ? "bg-emerald-50" : "bg-white hover:bg-gray-50"}`}
                        >
                          <TableCell className="text-gray-700 text-sm font-medium">
                            {m.days} days
                            {m.days === durationDays && (
                              <Badge className="ml-2 bg-emerald-600 text-white text-xs py-0">
                                Selected
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-green-600 text-sm text-right font-mono">
                            +{fmt(m.reward)}
                          </TableCell>
                          <TableCell className="text-emerald-600 text-sm text-right font-mono">
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
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-gray-900 font-bold text-base mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" /> Staking
                Details
              </h3>
              <ul className="space-y-2 text-sm text-gray-500">
                <li>
                  • Community Rewards Pool:{" "}
                  <span className="text-emerald-600 font-semibold">
                    8,000 RBS
                  </span>{" "}
                  (8% of total supply)
                </li>
                <li>
                  • Tier APYs:{" "}
                  <span className="text-emerald-600 font-semibold">
                    30d=8% · 90d=12% · 180d=15% · 365d=20%
                  </span>
                </li>
                <li>
                  • Compound interest formula:{" "}
                  <span className="text-emerald-600 font-mono text-xs">
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
