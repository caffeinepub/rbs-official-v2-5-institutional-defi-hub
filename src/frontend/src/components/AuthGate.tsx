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
                background: "rgba(16,185,129,0.2)",
                filter: "blur(12px)",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <img
              src="/assets/uploads/IMG_20250821_154306_073-13-1.jpg"
              alt="RBS"
              className="relative w-16 h-16 rounded-full object-cover"
            />
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
                className="w-2 h-2 rounded-full bg-emerald-500"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
          <p className="text-sm text-gray-500">Loading RBS Superior...</p>
        </motion.div>
      </div>
    );
  }

  return null;
}
