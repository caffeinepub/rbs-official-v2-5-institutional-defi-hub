import { ReactNode } from 'react';

interface PageShellProps {
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
}

export function PageShell({ children, maxWidth = 'xl', className = '' }: PageShellProps) {
  const maxWidthClass = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-5xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className={`min-h-screen pb-24 ${className}`}>
      <div className={`container mx-auto px-4 py-12 ${maxWidthClass}`}>
        {children}
      </div>
    </div>
  );
}
