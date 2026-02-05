import { ReactNode, useEffect, useRef, useState } from 'react';

interface SmokySectionTransitionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SmokySectionTransition({ children, delay = 0, className = '' }: SmokySectionTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={sectionRef}
      className={`smoky-section-wrapper ${isVisible ? 'smoky-section-visible' : 'smoky-section-hidden'} ${className}`}
    >
      {children}
    </div>
  );
}
