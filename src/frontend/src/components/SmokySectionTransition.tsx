import { ReactNode, useEffect, useRef, useState } from 'react';

interface SmokySectionTransitionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SmokySectionTransition({ children, delay = 0, className = '' }: SmokySectionTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      setHasBeenVisible(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
            setHasBeenVisible(true);
            if (observerRef.current && sectionRef.current) {
              observerRef.current.unobserve(sectionRef.current);
            }
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observerRef.current.observe(sectionRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, hasBeenVisible]);

  return (
    <div
      ref={sectionRef}
      className={`smoky-section-wrapper ${isVisible ? 'smoky-section-visible' : 'smoky-section-hidden'} ${className}`}
    >
      {children}
    </div>
  );
}
