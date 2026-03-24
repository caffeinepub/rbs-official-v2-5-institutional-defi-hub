import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Camera,
  CheckCircle,
  Loader2,
  RefreshCw,
  Shield,
  UserCircle2,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { a, b, answer: a + b };
}

function getLocalProfile(principalId: string) {
  try {
    const raw = localStorage.getItem(`rbsLocalProfile_${principalId}`);
    if (!raw) return null;
    return JSON.parse(raw) as { username: string; avatarUrl?: string };
  } catch {
    return null;
  }
}

function saveLocalProfile(
  principalId: string,
  data: { username: string; avatarUrl?: string },
) {
  localStorage.setItem(`rbsLocalProfile_${principalId}`, JSON.stringify(data));
}

type UsernameStatus = "idle" | "checking" | "available" | "taken";

export function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const usernameDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [visible, setVisible] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [captcha, setCaptcha] = useState(generateCaptcha);
  const [captchaInput, setCaptchaInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [saving, setSaving] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");

  const principalId = useMemo(
    () => identity?.getPrincipal().toString() ?? "",
    [identity],
  );

  const profileKey = useMemo(
    () => ["callerProfile", principalId],
    [principalId],
  );

  const { data: profile, isLoading } = useQuery({
    queryKey: profileKey,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;
    setVisible(profile === null);
  }, [isAuthenticated, isLoading, profile]);

  const checkUsernameUniqueness = useCallback(
    async (value: string) => {
      if (!actor || !value.trim()) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      try {
        const isTaken = await actor.isUsernameTaken(value.trim());
        setUsernameStatus(isTaken ? "taken" : "available");
        if (isTaken) setUsernameError("Username already taken");
        else setUsernameError("");
      } catch {
        setUsernameStatus("available");
      }
    },
    [actor],
  );

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameError("");
    setUsernameStatus("idle");
    if (usernameDebounceRef.current) clearTimeout(usernameDebounceRef.current);
    if (value.trim()) {
      usernameDebounceRef.current = setTimeout(
        () => checkUsernameUniqueness(value),
        500,
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRefreshCaptcha = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
  };

  const handleSubmit = async () => {
    setNameError("");
    setUsernameError("");
    setCaptchaError("");

    if (!displayName.trim()) {
      setNameError("Display name is required");
      return;
    }
    if (!username.trim()) {
      setUsernameError("Username is required");
      return;
    }
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username.trim())) {
      setUsernameError("3–20 chars: letters, numbers, underscores only");
      return;
    }
    if (usernameStatus === "taken") {
      setUsernameError("Username already taken — choose another");
      return;
    }
    if (usernameStatus === "checking") {
      toast.error("Please wait while we check username availability");
      return;
    }
    if (Number.parseInt(captchaInput) !== captcha.answer) {
      setCaptchaError("Wrong answer — try again");
      handleRefreshCaptcha();
      return;
    }
    if (!actor) return;

    // Final uniqueness check
    await checkUsernameUniqueness(username);
    await new Promise((r) => setTimeout(r, 100));

    setSaving(true);
    try {
      // Save profile to backend with username and displayName
      await actor.saveCallerUserProfile({
        username: username.trim(),
        displayName: displayName.trim(),
        email: email.trim() || undefined,
        avatarUrl: avatarPreview || undefined,
      } as any);

      // ── FIX 3: always set registration date on first profile save ─────────
      const msKey = `rbsMemberSince_${principalId}`;
      if (!localStorage.getItem(msKey)) {
        localStorage.setItem(msKey, new Date().toISOString());
      }

      saveLocalProfile(principalId, {
        username: username.trim(),
        avatarUrl: avatarPreview ?? undefined,
      });
      await queryClient.invalidateQueries({ queryKey: profileKey });
      await queryClient.invalidateQueries({ queryKey: ["allUserProfiles"] });
      await queryClient.invalidateQueries({
        queryKey: ["callerRegistrationDate", principalId],
      });
      toast.success("Profile saved! Welcome to RBS Superior.");
      setVisible(false);
    } catch {
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.5)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        data-ocid="profile-setup.modal"
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-sky-100 overflow-hidden"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div
            className="px-6 pt-6 pb-4"
            style={{
              background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <UserCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  Complete Your Profile
                </h2>
                <p className="text-xs text-sky-100">
                  Required to access RBS Superior
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                className="relative w-20 h-20 rounded-full border-2 border-dashed border-sky-300 flex items-center justify-center cursor-pointer group hover:border-sky-500 transition-colors overflow-hidden bg-sky-50 p-0"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserCircle2 className="h-10 w-10 text-sky-300 group-hover:text-sky-500 transition-colors" />
                )}
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                data-ocid="profile-setup.upload_button"
              />
              <p className="text-xs text-gray-400">
                Click to upload photo (optional)
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-1">
              <Label className="text-gray-700 font-medium">
                Display Name <span className="text-red-500">*</span>
              </Label>
              <Input
                data-ocid="profile-setup.name.input"
                placeholder="e.g. CryptoTrader99"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setNameError("");
                }}
                className="border-gray-200 focus:border-sky-400"
              />
              {nameError && (
                <p
                  data-ocid="profile-setup.name.error_state"
                  className="text-xs text-red-500"
                >
                  {nameError}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-1">
              <Label className="text-gray-700 font-medium">
                Username <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  data-ocid="profile-setup.input"
                  placeholder="e.g. crypto_trader (3–20 chars)"
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={`pr-8 border-gray-200 focus:border-sky-400 ${
                    usernameStatus === "taken"
                      ? "border-red-300"
                      : usernameStatus === "available"
                        ? "border-emerald-300"
                        : ""
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  {usernameStatus === "checking" && (
                    <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  {usernameStatus === "taken" && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
              {usernameStatus === "available" && (
                <p className="text-xs text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Username available
                </p>
              )}
              {usernameError && (
                <p
                  data-ocid="profile-setup.username.error_state"
                  className="text-xs text-red-500"
                >
                  {usernameError}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label className="text-gray-700 font-medium">
                Email <span className="text-gray-400">(optional)</span>
              </Label>
              <Input
                data-ocid="profile-setup.email.input"
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-200 focus:border-sky-400"
              />
            </div>

            {/* CAPTCHA */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 font-medium flex items-center gap-1">
                  <Shield className="h-4 w-4 text-sky-500" /> CAPTCHA
                </Label>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Refresh CAPTCHA"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 text-center font-bold text-gray-800">
                  {captcha.a} + {captcha.b} = ?
                </div>
                <Input
                  data-ocid="profile-setup.captcha.input"
                  type="number"
                  placeholder="Answer"
                  value={captchaInput}
                  onChange={(e) => {
                    setCaptchaInput(e.target.value);
                    setCaptchaError("");
                  }}
                  className="w-24 border-gray-200 focus:border-sky-400 text-center"
                />
              </div>
              {captchaError && (
                <p
                  data-ocid="profile-setup.captcha.error_state"
                  className="text-xs text-red-500"
                >
                  {captchaError}
                </p>
              )}
            </div>

            <Button
              data-ocid="profile-setup.submit_button"
              onClick={handleSubmit}
              disabled={
                saving ||
                usernameStatus === "taken" ||
                usernameStatus === "checking"
              }
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...
                </>
              ) : (
                "Create Profile & Enter"
              )}
            </Button>

            <p className="text-xs text-center text-gray-400">
              Profile is required to access the platform
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export { getLocalProfile };
