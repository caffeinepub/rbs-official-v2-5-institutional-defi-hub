import { useEffect, useRef, useState } from "react";

export type AnimationType =
  | "fade-up"
  | "fade-in"
  | "slide-left"
  | "slide-right"
  | "fade-scale"
  | "slide-rotate"
  | "bounce-in"
  | "scale-up"
  | "fade-left"
  | "fade-right";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  animationType?: AnimationType;
  once?: boolean;
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const {
    threshold = 0.15,
    rootMargin = "0px 0px -50px 0px",
    once = true,
  } = options;
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin },
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

export function useScrollAnimationClass(
  isVisible: boolean,
  animationType: AnimationType = "fade-up",
): string {
  const base = "transition-all duration-700 ease-out";
  if (isVisible) {
    return `${base} opacity-100 translate-y-0 translate-x-0 scale-100`;
  }
  switch (animationType) {
    case "fade-up":
      return `${base} opacity-0 translate-y-10`;
    case "fade-in":
      return `${base} opacity-0`;
    case "fade-left":
    case "slide-left":
      return `${base} opacity-0 -translate-x-10`;
    case "fade-right":
    case "slide-right":
      return `${base} opacity-0 translate-x-10`;
    case "scale-up":
    case "fade-scale":
      return `${base} opacity-0 scale-95`;
    case "slide-rotate":
      return `${base} opacity-0 rotate-3 scale-95`;
    case "bounce-in":
      return `${base} opacity-0 scale-90`;
    default:
      return `${base} opacity-0 translate-y-10`;
  }
}
