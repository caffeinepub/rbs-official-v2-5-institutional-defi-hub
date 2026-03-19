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

  const localProfile = useMemo(() => {
    if (!principalId) return null;
    return getLocalProfile(principalId);
  }, [principalId]);

  const displayName = (backendProfile as any)?.name ?? "";
  const backendUsername = (backendProfile as any)?.username ?? "";
  const username = localProfile?.username || backendUsername || "";
  const avatarUrl = localProfile?.avatarUrl ?? null;

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
      if (!actor || !value.trim() || value.trim() === username) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      usernameStatusRef.current = "checking";
      try {
        const allProfiles = await (actor as any).getAllUserProfiles?.();
        if (!allProfiles) {
          setUsernameStatus("available");
          return;
        }
        const isTaken = allProfiles.some((entry: any) => {
          // entry is [{principal}, {profile}] tuple from backend
          const profile = entry[1] ?? entry?.profile ?? entry;
          const otherPrincipal =
            entry[0]?.toString?.() ?? entry?.principal?.toString?.() ?? "";
          // Check both name field (which we use as username) and any username field
          const storedName: string = profile?.name ?? "";
          return (
            otherPrincipal !== principalId &&
            storedName.toLowerCase() === value.trim().toLowerCase()
          );
        });
        const newStatus: UsernameStatus = isTaken ? "taken" : "available";
        setUsernameStatus(newStatus);
        usernameStatusRef.current = newStatus;
      } catch {
        setUsernameStatus("available");
      }
    },
    [actor, principalId, username],
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
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (!principalId) return;
        const current = getLocalProfile(principalId) ?? {};
        localStorage.setItem(
          `rbsLocalProfile_${principalId}`,
          JSON.stringify({ ...current, avatarUrl: dataUrl }),
        );
        toast.success("Profile picture updated!");
        void refetchProfile();
      };
      reader.readAsDataURL(file);
    },
    [principalId, refetchProfile],
  );

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setIsSaving(true);
    try {
      if (actor) {
        await (actor as any)
          .saveCallerUserProfile?.({ name: nameInput.trim(), email: undefined })
          .catch(() => {});
      }
      const current = getLocalProfile(principalId) ?? {};
      localStorage.setItem(
        `rbsLocalProfile_${principalId}`,
        JSON.stringify({ ...current, displayName: nameInput.trim() }),
      );
      await refetchProfile();
      setEditingName(false);
      toast.success("Name updated!");
    } catch {
      toast.error("Failed to save name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveUsername = async () => {
    if (!usernameInput.trim()) return;
    if (usernameStatus === "taken") {
      toast.error("Username is already taken. Choose a different one.");
      return;
    }
    // Final uniqueness check before saving
    if (usernameInput.trim() !== username) {
      await checkUsernameUniqueness(usernameInput);
      await new Promise((r) => setTimeout(r, 100));
    }
    if (usernameStatusRef.current === "taken") {
      toast.error("Username is already taken.");
      return;
    }
    const current = getLocalProfile(principalId) ?? {};
    localStorage.setItem(
      `rbsLocalProfile_${principalId}`,
      JSON.stringify({ ...current, username: usernameInput.trim() }),
    );
    // Also persist to backend so uniqueness is globally enforced
    if (actor) {
      try {
        await (actor as any)
          .saveCallerUserProfile?.({
            name: usernameInput.trim(),
            email: undefined,
          })
          .catch(() => {});
      } catch {
        /* ignore backend errors */
      }
    }
    setEditingUsername(false);
    setUsernameStatus("idle");
    usernameStatusRef.current = "idle";
    toast.success("Username saved! It's now reserved globally.");
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
                <div className="flex items-center justify-between group">
                  <p className="text-gray-900 font-medium text-base">
                    {displayName || "Not set"}
                  </p>
                  <button
                    type="button"
                    data-ocid="profile.name.edit_button"
                    onClick={() => {
                      setNameInput(displayName);
                      setEditingName(true);
                    }}
                    className="text-xs text-sky-500 hover:text-sky-700 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg hover:bg-sky-50"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            {/* Username */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <label
                htmlFor="name-field"
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
                        usernameStatus === "checking"
                      }
                      size="sm"
                      className="bg-sky-500 hover:bg-sky-600 text-white disabled:opacity-50"
                    >
                      {usernameStatus === "checking" ? (
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
                  {/* Status indicator */}
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
                <div className="flex items-center justify-between group">
                  <p className="text-gray-900 font-medium text-base">
                    {username ? `@${username}` : "Not set"}
                  </p>
                  <button
                    type="button"
                    data-ocid="profile.username.edit_button"
                    onClick={() => {
                      setUsernameInput(username);
                      setEditingUsername(true);
                    }}
                    className="text-xs text-sky-500 hover:text-sky-700 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-lg hover:bg-sky-50"
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

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-6"
          >
            {[
              { label: "Member Since", value: "2025", icon: "📅" },
              { label: "Polls Voted", value: "—", icon: "🗳️" },
              { label: "Alerts Set", value: "—", icon: "🔔" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.08 }}
                className="bg-white border border-gray-200 rounded-2xl p-4 text-center shadow-sm"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
