import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Crown, Shield, Star, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import { PageHead } from "../components/PageHead";
import { useActor } from "../hooks/useActor";
import { useReliableAuth } from "../hooks/useReliableAuth";

interface MemberEntry {
  rank: number;
  principal: string;
  username: string;
  registeredAt: Date;
  accountAgeDays: number;
  tier: string;
  tierIcon: string;
  tierColor: string;
  tierBg: string;
}

function getTier(ageDays: number, isFirstThirty: boolean) {
  if (isFirstThirty)
    return {
      tier: "Pioneer",
      icon: "🌟",
      color: "text-yellow-700",
      bg: "bg-yellow-50 border-yellow-200",
    };
  if (ageDays <= 90)
    return {
      tier: "Early Adopter",
      icon: "🏅",
      color: "text-amber-700",
      bg: "bg-amber-50 border-amber-200",
    };
  if (ageDays <= 180)
    return {
      tier: "Member",
      icon: "⚡",
      color: "text-sky-700",
      bg: "bg-sky-50 border-sky-200",
    };
  return {
    tier: "Community",
    icon: "🔵",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
  };
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAge(days: number): string {
  if (days < 1) return "Today";
  if (days === 1) return "1 day";
  if (days < 30) return `${days} days`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    return months === 1 ? "1 month" : `${months} months`;
  }
  const years = Math.floor(days / 365);
  return years === 1 ? "1 year" : `${years} years`;
}

export default function MembersBoardPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useReliableAuth();
  const currentPrincipal = identity?.getPrincipal().toString() ?? "";

  const { data: rawProfiles, isLoading } = useQuery({
    queryKey: ["allUserProfiles"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getAllUserProfiles?.() ?? [];
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 60000,
  });

  const members: MemberEntry[] = useMemo(() => {
    if (!rawProfiles) return [];
    const withDate = rawProfiles
      .map((entry: any) => {
        const principal: string =
          entry?.principal?.toString?.() ?? entry?.principal ?? "";
        const profile = entry?.profile ?? entry;
        // registeredAt is on the entry wrapper (UserProfileEntry), not on profile
        const registeredAtRaw = entry?.registeredAt ?? profile?.registeredAt;
        let registeredAt: Date | null = null;
        if (Array.isArray(registeredAtRaw) && registeredAtRaw.length > 0) {
          const ns = registeredAtRaw[0];
          registeredAt = new Date(Number(BigInt(ns) / 1_000_000n));
        } else if (typeof registeredAtRaw === "bigint") {
          registeredAt = new Date(Number(registeredAtRaw / 1_000_000n));
        }
        if (!registeredAt) return null;
        const username = profile?.name ?? `${principal.slice(0, 12)}...`;
        return { principal, username, registeredAt };
      })
      .filter(Boolean)
      .sort(
        (a: any, b: any) => a.registeredAt.getTime() - b.registeredAt.getTime(),
      );

    if (withDate.length === 0) return [];
    const oldestTime = withDate[0].registeredAt.getTime();
    const now = Date.now();

    return withDate.map((m: any, i: number) => {
      const ageDays = Math.floor((now - m.registeredAt.getTime()) / 86400000);
      const daysFromOldest = Math.floor(
        (m.registeredAt.getTime() - oldestTime) / 86400000,
      );
      const isFirstThirty = daysFromOldest <= 30;
      const tierInfo = getTier(ageDays, isFirstThirty);
      return {
        rank: i + 1,
        principal: m.principal,
        username: m.username,
        registeredAt: m.registeredAt,
        accountAgeDays: ageDays,
        tier: tierInfo.tier,
        tierIcon: tierInfo.icon,
        tierColor: tierInfo.color,
        tierBg: tierInfo.bg,
      } as MemberEntry;
    });
  }, [rawProfiles]);

  return (
    <>
      <PageHead
        title="RBS Members Board"
        description="All registered RBS members ranked by account age. Earlier registration = higher reward priority."
      />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gradient-to-br from-sky-50 to-white border-b border-sky-100 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-sky-500 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
            >
              <Users className="w-3.5 h-3.5" />
              Early Membership Registry
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              RBS Members Board
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-500 text-lg max-w-2xl mx-auto"
            >
              Every verified member ranked by registration date. Future RBS
              token rewards and benefits will be distributed based on your
              account age — earlier means higher priority.
            </motion.p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Notice banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3"
          >
            <span className="text-2xl">📅</span>
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                Account Age = Future Reward Priority
              </p>
              <p className="text-amber-700 text-xs mt-0.5">
                The earlier you registered, the higher your reward tier will be
                when RBS token launches. Pioneers registered in the first 30
                days from the first member get the highest tier.
              </p>
            </div>
          </motion.div>

          {/* Tier legend */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {[
              {
                icon: "🌟",
                tier: "Pioneer",
                desc: "First 30 days",
                color: "border-yellow-200 bg-yellow-50",
              },
              {
                icon: "🏅",
                tier: "Early Adopter",
                desc: "31–90 days",
                color: "border-amber-200 bg-amber-50",
              },
              {
                icon: "⚡",
                tier: "Member",
                desc: "91–180 days",
                color: "border-sky-200 bg-sky-50",
              },
              {
                icon: "🔵",
                tier: "Community",
                desc: "181+ days",
                color: "border-blue-200 bg-blue-50",
              },
            ].map((t) => (
              <div
                key={t.tier}
                className={`border rounded-xl p-3 text-center ${t.color}`}
              >
                <div className="text-xl mb-1">{t.icon}</div>
                <p className="font-semibold text-gray-800 text-xs">{t.tier}</p>
                <p className="text-gray-500 text-[11px]">{t.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-sky-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {members.length}
                </p>
                <p className="text-xs text-gray-400">Total Members</p>
              </div>
            </div>
            {currentPrincipal &&
              (() => {
                const myEntry = members.find(
                  (m) => m.principal === currentPrincipal,
                );
                if (!myEntry) return null;
                return (
                  <div className="flex items-center gap-2 bg-sky-50 border border-sky-200 rounded-xl px-4 py-2">
                    <Crown className="w-4 h-4 text-sky-600" />
                    <div>
                      <p className="text-xs font-semibold text-sky-700">
                        Your Rank
                      </p>
                      <p className="text-lg font-bold text-sky-600">
                        #{myEntry.rank}
                      </p>
                    </div>
                  </div>
                );
              })()}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-400 text-sm">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div data-ocid="members.empty_state" className="text-center py-20">
              <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                No registered members yet
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Complete your profile to be the first!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member, index) => {
                const isMe = member.principal === currentPrincipal;
                return (
                  <motion.div
                    key={member.principal}
                    data-ocid={`members.item.${index + 1}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: Math.min(index * 0.04, 0.8),
                    }}
                    className={`border rounded-2xl p-4 flex items-center gap-4 transition-shadow ${
                      isMe
                        ? "bg-sky-50 border-sky-300 shadow-md"
                        : "bg-white border-gray-100 hover:shadow-sm"
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-10 text-center">
                      {member.rank <= 3 ? (
                        <div className="flex items-center justify-center">
                          {member.rank === 1 && (
                            <Crown className="w-5 h-5 text-yellow-500" />
                          )}
                          {member.rank === 2 && (
                            <Star className="w-5 h-5 text-gray-400" />
                          )}
                          {member.rank === 3 && (
                            <Shield className="w-5 h-5 text-amber-600" />
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 font-mono text-sm">
                          #{member.rank}
                        </span>
                      )}
                    </div>

                    {/* Avatar placeholder */}
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center">
                      <span className="text-sky-600 font-bold text-sm">
                        {(member.username[0] ?? "?").toUpperCase()}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p
                          className={`font-semibold text-sm truncate ${isMe ? "text-sky-700" : "text-gray-900"}`}
                        >
                          @{member.username}
                          {isMe && (
                            <span className="ml-1 text-[10px] font-bold text-sky-500">
                              (You)
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 font-mono truncate">
                        {member.principal.slice(0, 20)}...
                      </p>
                    </div>

                    {/* Date + Age */}
                    <div className="hidden sm:flex flex-col items-end text-right flex-shrink-0">
                      <div className="flex items-center gap-1 text-gray-600 text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(member.registeredAt)}
                      </div>
                      <div className="flex items-center gap-1 text-gray-400 text-[11px] mt-0.5">
                        <Zap className="w-3 h-3" />
                        {formatAge(member.accountAgeDays)} old
                      </div>
                    </div>

                    {/* Tier badge */}
                    <div className="flex-shrink-0">
                      <Badge
                        className={`border text-xs font-semibold ${member.tierBg} ${member.tierColor}`}
                      >
                        {member.tierIcon} {member.tier}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-center"
          >
            <p className="text-gray-400 text-sm">
              Connect your wallet and complete your profile to appear on this
              board
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Board refreshes every 60 seconds · Sorted by registration date
              (oldest first)
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
