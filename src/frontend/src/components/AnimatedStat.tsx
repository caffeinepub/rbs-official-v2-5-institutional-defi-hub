import { useCountUp } from "@/hooks/useCountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { LucideIcon } from "lucide-react";
import type React from "react";
import { useRef } from "react";

interface AnimatedStatProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  icon?: LucideIcon;
  className?: string;
}

export function AnimatedStat({
  value,
  label,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 2000,
  icon: Icon,
  className = "",
}: AnimatedStatProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const animatedValue = useCountUp(value, duration, decimals, isVisible);

  const formatted = animatedValue.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`flex flex-col items-center gap-1 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {Icon && (
        <div className="mb-1 text-[var(--rbs-gold)]">
          <Icon size={24} />
        </div>
      )}
      <div className="text-3xl font-bold text-[var(--rbs-gold)] tabular-nums">
        {prefix}
        {formatted}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground text-center">{label}</div>
    </div>
  );
}
