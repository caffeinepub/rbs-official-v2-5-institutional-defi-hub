import { useEffect } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ScrollToTop() {
  const routerState = useRouterState();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [routerState.location.pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      onClick={scrollToTop}
      className="fixed bottom-32 right-6 z-40 h-12 w-12 rounded-full bg-gradient-to-r from-gold-matte to-gold-light hover:from-gold-light hover:to-gold-matte text-dark-matter shadow-gold-lg hover:shadow-gold-xl transition-all duration-300 hover:scale-110"
      size="icon"
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
