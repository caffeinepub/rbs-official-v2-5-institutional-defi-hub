import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useReliableAuth } from "../hooks/useReliableAuth";

export function AuthGate() {
  const { isAuthenticated, isInitializing } = useReliableAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isInitializing) return;
    if (!isAuthenticated && location.pathname !== "/login") {
      navigate({ to: "/login" });
    }
    if (isAuthenticated && location.pathname === "/login") {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, isInitializing, location.pathname, navigate]);

  if (isInitializing) {
    return (
      <div
        data-ocid="auth.loading_state"
        className="fixed inset-0 z-[600] flex flex-col items-center justify-center bg-white"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "rgba(14,165,233,0.2)",
                filter: "blur(12px)",
                top: "-4px",
                left: "-4px",
                right: "-4px",
                bottom: "-4px",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">RBS</span>
            </div>
          </div>
          <motion.div
            className="flex gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-sky-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
          <p className="text-sm text-gray-500 font-medium">
            Loading RBS Superior...
          </p>
        </motion.div>
      </div>
    );
  }

  return null;
}
