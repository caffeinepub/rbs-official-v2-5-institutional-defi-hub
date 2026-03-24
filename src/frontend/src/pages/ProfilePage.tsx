import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Camera, CheckCircle, Loader2, User, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { PageHead } from "../components/PageHead";
import { getLocalProfile } from "../components/ProfileSetupModal";
import { useActor } from "../hooks/useActor";
import { useReliableAuth } from "../hooks/useReliableAuth";

type UsernameStatus = "idle" | "checking" | "available" | "taken";

const BADGE_TIERS = [
  {
    years: 1,
    title: "Newbie",
    emoji: "🌱",
    color: "from-emerald-500 to-green-600",
  },
  {
    years: 2,
    title: "Early Adaptor",
    emoji: "🚀",
    color: "from-sky-500 to-blue-600",
  },
  {
    years: 3,
    title: "Superior Community",
    emoji: "⚡",
    color: "from-purple-500 to-violet-600",
  },
  {
    years: 4,
    title: "RBS HEROIC",
    emoji: "🔥",
    color: "from-red-500 to-rose-600",
  },
  {
    years: 5,
    title: "RBS MASTER",
    emoji: "👑",
    color: "from-yellow-500 to-amber-600",
  },
];

function formatAccountAge(ms: number): string {
  const totalMonths = Math.floor(
    (Date.now() - ms) / (1000 * 60 * 60 * 24 * 30.44),
  );
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return months <= 1 ? `${months} month` : `${months} months`;
  if (months === 0) return years === 1 ? "1 year" : `${years} years`;
  return `${years} yr ${months} mo`;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { identity, isAuthenticated } = useReliableAuth();
  const { actor, isFetching: actorFetching } = useActor();

  const principalId = useMemo(
    () => identity?.getPrincipal().toString() ?? "",
    [identity],
  );

  const { data: backendProfile, refetch: refetchProfile } = useQuery({
    queryKey: ["callerProfile", principalId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  const { data: registrationDateMs } = useQuery({
    queryKey: ["callerRegistrationDate", principalId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await (actor as any).getCallerRegistrationDate?.();
      if (!result || result.length === 0) return null;
      return Number(result[0]) / 1_000_000;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  // ── FIX 2: effective registration date with localStorage fallback ──────────
  const effectiveRegistrationDateMs = useMemo(() => {
    if (registrationDateMs) return registrationDateMs;
    if (!principalId) return null;
    const key = `rbsMemberSince_${principalId}`;
    const stored = localStorage.getItem(key);
    if (stored) return new Date(stored).getTime();
    return null;
  }, [registrationDateMs, principalId]);

  const memberSince = useMemo(() => {
    if (!effectiveRegistrationDateMs) return "—";
    return new Date(effectiveRegistrationDateMs).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }, [effectiveRegistrationDateMs]);

  const accountBadge = useMemo(() => {
    if (!effectiveRegistrationDateMs) return null;
    const years =
      (Date.now() - effectiveRegistrationDateMs) /
      (1000 * 60 * 60 * 24 * 365.25);
    for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
      if (years >= BADGE_TIERS[i].years) return BADGE_TIERS[i];
    }
    return null;
  }, [effectiveRegistrationDateMs]);

  // Progress toward next badge
  const badgeProgress = useMemo(() => {
    if (!effectiveRegistrationDateMs) return null;
    const years =
      (Date.now() - effectiveRegistrationDateMs) /
      (1000 * 60 * 60 * 24 * 365.25);
    if (years >= 5)
      return { maxRank: true, pct: 100, label: "", nextTitle: "" };
    const nextTier = BADGE_TIERS.find((t) => t.years > years);
    if (!nextTier) return null;
    const prevYears = nextTier.years - 1;
    const pct = Math.min(100, Math.round(((years - prevYears) / 1) * 100));
    const monthsLeft = Math.ceil((nextTier.years - years) * 12);
    const label = monthsLeft <= 1 ? "1 month" : `${monthsLeft} months`;
    return { maxRank: false, pct, label, nextTitle: nextTier.title };
  }, [effectiveRegistrationDateMs]);

  const localProfile = useMemo(() => {
    if (!principalId) return null;
    return getLocalProfile(principalId);
  }, [principalId]);

  // ── FIX 1: backend is source of truth ─────────────────────────────────────
  const displayName =
    (backendProfile as any)?.displayName ?? (backendProfile as any)?.name ?? "";
  const backendUsername = (() => {
    const u = (backendProfile as any)?.username;
    return u ?? "";
  })();
  const username = backendUsername || localProfile?.username || "";
  const avatarUrl = (() => {
    const bu = (backendProfile as any)?.avatarUrl;
    return (Array.isArray(bu) ? bu[0] : bu) ?? localProfile?.avatarUrl ?? null;
  })();

  // ── FIX 6: sync backend → localStorage on re-login ───────────────────────
  useEffect(() => {
    if (backendUsername && principalId) {
      const current: { username?: string; avatarUrl?: string } =
        getLocalProfile(principalId) ?? {};
      if (current.username !== backendUsername) {
        localStorage.setItem(
          `rbsLocalProfile_${principalId}`,
          JSON.stringify({ ...current, username: backendUsername }),
        );
      }
    }
  }, [backendUsername, principalId]);

  const [editingName, setEditingName] = useState(false);
  const [editingUsername, setEditingUsername] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [usernameInput, setUsernameInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const usernameStatusRef = useRef<UsernameStatus>("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Sync inputs when profile loads
  useEffect(() => {
    setNameInput(displayName);
    setUsernameInput(username);
  }, [displayName, username]);

  const checkUsernameUniqueness = useCallback(
    async (value: string) => {
      // ── FIX 4: if unchanged, skip check ───────────────────────────────────
      if (!actor || !value.trim() || value.trim() === username) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      usernameStatusRef.current = "checking";
      try {
        const isTaken = await actor.isUsernameTaken(value.trim());
        const newStatus: UsernameStatus = isTaken ? "taken" : "available";
        setUsernameStatus(newStatus);
        usernameStatusRef.current = newStatus;
      } catch {
        setUsernameStatus("available");
      }
    },
    [actor, username],
  );

  const handleUsernameChange = (value: string) => {
    setUsernameInput(value);
    setUsernameStatus("idle");
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    if (value.trim() && value.trim() !== username) {
      usernameDebounceRef.current = setTimeout(
        () => checkUsernameUniqueness(value),
        500,
      );
    }
  };

  const handleAvatarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!principalId) return;
        const current: { username?: string; avatarUrl?: string } =
          getLocalProfile(principalId) ?? {};
        localStorage.setItem(
          `rbsLocalProfile_${principalId}`,
          JSON.stringify({ ...current, avatarUrl: dataUrl }),
        );
        if (actor) {
          try {
            await (actor as any)
              .saveCallerUserProfile?.({
                username: username || "",
                displayName: displayName || "",
                email: [],
                avatarUrl: [dataUrl],
              })
              .catch(() => {});
          } catch {
            /* ignore */
          }
        }
        toast.success("Profile picture updated!");
        void refetchProfile();
      };
      reader.readAsDataURL(file);
    },
    [principalId, refetchProfile, actor, username, displayName],
  );

  // ── FIX 5: show backend error in handleSaveName ───────────────────────────
  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    try {
      if (actor) {
        await (actor as any).saveCallerUserProfile?.({
          username: username || "",
          displayName: nameInput.trim(),
          email: undefined,
          avatarUrl: undefined,
        });
      }
      const current: { username?: string; avatarUrl?: string } =
        getLocalProfile(principalId) ?? {};
      localStorage.setItem(
        `rbsLocalProfile_${principalId}`,
        JSON.stringify({ ...current, displayName: nameInput.trim() }),
      );
      const msKey = `rbsMemberSince_${principalId}`;
      if (!localStorage.getItem(msKey)) {
        localStorage.setItem(msKey, new Date().toISOString());
      }
      await refetchProfile();
      setEditingName(false);
      toast.success("Name updated!");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save name");
    } finally {
      setIsSaving(false);
    }
  };

  // ── FIX 5: show backend error in handleSaveUsername ───────────────────────
  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return;
    if (usernameStatus === "taken") {
      toast.error("Username is already taken. Choose a different one.");
      return;
    }
    if (usernameInput.trim() !== username) {
      await checkUsernameUniqueness(usernameInput);
      await new Promise((r) => setTimeout(r, 100));
    }
    if (usernameStatusRef.current === "taken") {
      toast.error("Username is already taken.");
      return;
    }
    setIsSaving(true);
    try {
      if (actor) {
        await (actor as any).saveCallerUserProfile?.({
          username: usernameInput.trim(),
          displayName: displayName || "",
          email: undefined,
          avatarUrl: undefined,
        });
      }
      const current: { username?: string; avatarUrl?: string } =
        getLocalProfile(principalId) ?? {};
      localStorage.setItem(
        `rbsLocalProfile_${principalId}`,
        JSON.stringify({ ...current, username: usernameInput.trim() }),
      );
      await refetchProfile();
      setEditingUsername(false);
      setUsernameStatus("idle");
      usernameStatusRef.current = "idle";
      toast.success("Username saved! It's now reserved globally.");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save username");
    } finally {
      setIsSaving(false);
    }
  };

  // Profile completion %
  const completionSteps = [
    !!avatarUrl,
    !!displayName,
    !!username,
    !!principalId,
  ];
  const completionPct = Math.round(
    (completionSteps.filter(Boolean).length / completionSteps.length) * 100,
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            Please sign in to view your profile.
          </p>
          <Button
            onClick={() => navigate({ to: "/login" })}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHead
        title="My Profile | RBS"
        description="View and edit your RBS profile"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Hero banner */}
        <div
          className="relative h-36 sm:h-44"
          style={{
            background:
              "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 50%, rgba(14,165,233,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(16,185,129,0.08) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%230ea5e9' fill-opacity='0.4'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-20">
          {/* Avatar + identity row */}
          <div className="relative flex items-end gap-4 -mt-16 mb-6">
            <motion.div
              className="relative flex-shrink-0"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <button
                type="button"
                data-ocid="profile.avatar.upload_button"
                onClick={() => fileInputRef.current?.click()}
                className="relative block w-28 h-28 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-sky-100 cursor-pointer"
                title="Click to change photo"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-12 h-12 text-sky-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/25 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-white text-xs font-medium">Edit</span>
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </motion.div>

            <div className="pb-2 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-sky-50 text-sky-600 border-sky-200">
                  RBS Member
                </Badge>
                {completionPct === 100 && (
                  <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200">
                    ✓ Complete
                  </Badge>
                )}
              </div>
              {username && (
                <p className="text-lg font-bold text-gray-900">@{username}</p>
              )}
              <p className="text-xs text-gray-400 font-mono truncate max-w-[180px] sm:max-w-xs">
                {principalId.slice(0, 24)}...
              </p>
            </div>
          </div>

          {/* Completion bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm mb-5"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700">
                Profile Completion
              </span>
              <span className="text-xs font-bold text-sky-600">
                {completionPct}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPct}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full bg-sky-500 rounded-full"
              />
            </div>
            <div className="flex gap-4 mt-2">
              {[
                { label: "Avatar", done: !!avatarUrl },
                { label: "Name", done: !!displayName },
                { label: "Username", done: !!username },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-1">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      item.done ? "bg-sky-500" : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={`text-[11px] ${
                      item.done ? "text-sky-600 font-medium" : "text-gray-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Profile card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Profile Details
            </h2>

            {/* Display Name */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <label
                htmlFor="name-field"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Display Name
              </label>
              {editingName ? (
                <div className="flex gap-2">
                  <Input
                    data-ocid="profile.name.input"
                    id="name-field"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                    placeholder="Your display name"
                    className="flex-1 border-sky-200 focus:border-sky-400"
                    autoFocus
                  />
                  <Button
                    data-ocid="profile.name.save_button"
                    onClick={handleSaveName}
                    disabled={isSaving || !nameInput.trim()}
                    size="sm"
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    data-ocid="profile.name.cancel_button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingName(false);
                      setNameInput(displayName);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-medium text-base">
                    {displayName || "Not set"}
                  </p>
                  {/* ── FIX 9: always-visible edit button ─────────────────── */}
                  <button
                    type="button"
                    data-ocid="profile.name.edit_button"
                    onClick={() => {
                      setNameInput(displayName);
                      setEditingName(true);
                    }}
                    className="text-xs text-sky-500 hover:text-sky-700 transition-colors px-2 py-1 rounded-lg hover:bg-sky-50"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Username */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <label
                htmlFor="username-field"
                className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5"
              >
                Username
              </label>
              {editingUsername ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        @
                      </span>
                      <Input
                        data-ocid="profile.username.input"
                        id="username-field"
                        value={usernameInput}
                        onChange={(e) => handleUsernameChange(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          usernameStatus !== "taken" &&
                          handleSaveUsername()
                        }
                        placeholder="username"
                        className={`pl-7 border-sky-200 focus:border-sky-400 ${
                          usernameStatus === "taken"
                            ? "border-red-300 focus:border-red-400"
                            : usernameStatus === "available"
                              ? "border-emerald-300 focus:border-emerald-400"
                              : ""
                        }`}
                        autoFocus
                      />
                    </div>
                    <Button
                      data-ocid="profile.username.save_button"
                      onClick={handleSaveUsername}
                      disabled={
                        !usernameInput.trim() ||
                        usernameStatus === "taken" ||
                        usernameStatus === "checking" ||
                        isSaving
                      }
                      size="sm"
                      className="bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50"
                    >
                      {usernameStatus === "checking" || isSaving ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </Button>
                    <Button
                      data-ocid="profile.username.cancel_button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingUsername(false);
                        setUsernameInput(username);
                        setUsernameStatus("idle");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  {usernameStatus === "checking" && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Checking availability...
                    </div>
                  )}
                  {usernameStatus === "available" && (
                    <div
                      data-ocid="profile.username.success_state"
                      className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Username available
                    </div>
                  )}
                  {usernameStatus === "taken" && (
                    <div
                      data-ocid="profile.username.error_state"
                      className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
                    >
                      <XCircle className="h-3 w-3" />
                      Username already taken
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-gray-900 font-medium text-base">
                    {username ? `@${username}` : "Not set"}
                  </p>
                  {/* ── FIX 9: always-visible edit button ─────────────────── */}
                  <button
                    type="button"
                    data-ocid="profile.username.edit_button"
                    onClick={() => {
                      setUsernameInput(username);
                      setEditingUsername(true);
                    }}
                    className="text-xs text-sky-500 hover:text-sky-700 transition-colors px-2 py-1 rounded-lg hover:bg-sky-50"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Principal ID */}
            <div>
              <p className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                Principal ID
              </p>
              <p className="text-gray-600 text-xs font-mono bg-gray-50 rounded-lg px-3 py-2 break-all border border-gray-100">
                {principalId}
              </p>
            </div>
          </motion.div>

          {/* ── Member Since card ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-4"
          >
            <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">📅</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sky-100 text-xs font-semibold uppercase tracking-widest mb-0.5">
                    Member Since
                  </p>
                  <p className="text-white text-xl font-bold">{memberSince}</p>
                  {/* ── FIX 8: account age text ──────────────────────────── */}
                  {effectiveRegistrationDateMs && (
                    <p className="text-sky-200 text-[11px] mt-0.5">
                      Account Age ·{" "}
                      {formatAccountAge(effectiveRegistrationDateMs)}
                    </p>
                  )}
                  {!effectiveRegistrationDateMs && (
                    <p className="text-sky-200 text-[11px] mt-0.5">
                      Registration Date · RBS Official
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Account Badge card ────────────────────────────────────────── */}
          {accountBadge && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className={`bg-gradient-to-br ${accountBadge.color} rounded-2xl p-5 shadow-lg mb-4`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">{accountBadge.emoji}</span>
                </div>
                <div>
                  <p className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-0.5">
                    Account Badge
                  </p>
                  <p className="text-white text-xl font-bold">
                    {accountBadge.title}
                  </p>
                  <p className="text-white/70 text-[11px] mt-0.5">
                    Earned by account age · RBS Official
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FIX 7: Badge progress bar ─────────────────────────────────── */}
          {badgeProgress && effectiveRegistrationDateMs && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4"
            >
              {badgeProgress.maxRank ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Max Rank Achieved
                    </p>
                    <p className="text-xs text-gray-500">
                      You've reached the highest badge level — RBS MASTER.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-700">
                      Progress toward{" "}
                      <span className="text-sky-600 font-bold">
                        {badgeProgress.nextTitle}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-sky-600">
                      {badgeProgress.pct}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${badgeProgress.pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {badgeProgress.label} until next rank · Keep holding!
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* Unlock-once hint for new accounts */}
          {!effectiveRegistrationDateMs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-center mb-4"
            >
              <p className="text-xs text-sky-600">
                Your account age badge will appear once your registration date
                is confirmed by the network.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
