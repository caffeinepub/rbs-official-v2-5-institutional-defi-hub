import { useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  Bell,
  CheckCircle,
  MessageCircle,
  Shield,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { useReliableAuth } from "../hooks/useReliableAuth";

const FEATURES = [
  {
    icon: Zap,
    label: "G-Man Intelligence",
    desc: "Real-time AI trading signals",
  },
  {
    icon: TrendingUp,
    label: "Trading Tools",
    desc: "12+ professional calculators",
  },
  {
    icon: BarChart2,
    label: "Market Dashboard",
    desc: "Live crypto & forex data",
  },
  { icon: Bell, label: "Alerts Center", desc: "Custom price notifications" },
  {
    icon: Users,
    label: "Community Polls",
    desc: "Vote & see market sentiment",
  },
  {
    icon: Shield,
    label: "Developer Blog",
    desc: "Exclusive insights & updates",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing, handleLogin, isDisabled } =
    useReliableAuth();

  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  return (
    <div
      data-ocid="login.page"
      className="fixed inset-0 z-[500] overflow-y-auto"
      style={{
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f8faff 60%, #ecfdf5 100%)",
      }}
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)",
            top: "-10%",
            left: "-5%",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(14,165,233,0.1) 0%, transparent 70%)",
            bottom: "10%",
            right: "-5%",
          }}
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
            top: "40%",
            left: "50%",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 4,
          }}
        />
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: stable decorative elements
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{
              left: `${10 + ((i * 8) % 80)}%`,
              top: `${15 + ((i * 13) % 70)}%`,
              opacity: 0.3,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg"
        >
          {/* Logo */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-4">
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "rgba(16,185,129,0.2)",
                  filter: "blur(12px)",
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="relative w-20 h-20 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-2xl ring-4 ring-sky-100 ring-offset-2">
                RBS
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Welcome to <span className="text-emerald-600">RBS Superior</span>
            </h1>
            <p className="mt-2 text-center text-gray-500 text-base max-w-sm">
              Sign in to access real-time market intelligence, trading tools,
              and the RBS community
            </p>
          </motion.div>

          {/* Login card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl border border-emerald-100 p-8 mb-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-1">
                Create Account or Sign In
              </h2>
              <p className="text-sm text-gray-500">
                You can register with your email or Google account
              </p>
            </div>

            {/* Google / Social Sign-in Button */}
            <motion.button
              data-ocid="login.google.button"
              type="button"
              onClick={handleLogin}
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-6 rounded-xl font-semibold text-gray-700 text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-3 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"
              style={{
                boxShadow: isDisabled ? "none" : "0 2px 8px rgba(0,0,0,0.08)",
              }}
              whileHover={!isDisabled ? { scale: 1.01, y: -1 } : {}}
              whileTap={!isDisabled ? { scale: 0.99 } : {}}
            >
              {/* Google-colored G icon */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-label="Google"
                role="img"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </motion.button>

            <div className="relative flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 whitespace-nowrap">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Internet Identity Button */}
            <motion.button
              data-ocid="login.primary_button"
              type="button"
              onClick={handleLogin}
              disabled={isDisabled}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold text-white text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: isDisabled
                  ? "#6b7280"
                  : "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
                boxShadow: isDisabled
                  ? "none"
                  : "0 4px 20px rgba(16,185,129,0.4)",
              }}
              whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
            >
              {isDisabled ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  Sign in with Internet Identity
                </>
              )}
            </motion.button>

            <p className="mt-4 text-center text-xs text-gray-400">
              Internet Identity supports Google, Face ID & fingerprint login
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["🔒 Private", "⚡ Fast", "🌐 Web3"].map((item) => (
                <div
                  key={item}
                  className="text-xs text-gray-500 bg-gray-50 rounded-lg py-2"
                >
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 gap-3 mb-6"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                className="bg-white/80 backdrop-blur rounded-xl border border-gray-100 p-3 flex items-start gap-2"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <f.icon className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    {f.label}
                  </div>
                  <div className="text-xs text-gray-400">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 text-sm">
              <a
                href="https://whatsapp.com/channel/0029VbB6FHV59PwWv9wIE93P"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Channel
              </a>
              <span className="text-gray-200">·</span>
              <a
                href="https://t.me/RBSuperior"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-gray-500 hover:text-emerald-600 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Telegram
              </a>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-emerald-600"
              >
                caffeine.ai
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
