import { ReactNode, useEffect, useState } from 'react';

interface MotionSafeProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  delay?: number;
  className?: string;
}

export function MotionSafe({ 
  children, 
  animation = 'fade', 
  delay = 0, 
  className = '' 
}: MotionSafeProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (prefersReducedMotion || animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  const animationClass = isVisible
    ? animation === 'fade'
      ? 'animate-fade-in'
      : animation === 'slide'
      ? 'animate-slide-in'
      : animation === 'scale'
      ? 'animate-scale-in'
      : ''
    : 'opacity-0';

  return <div className={`${animationClass} ${className}`}>{children}</div>;
}
