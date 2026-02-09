import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, FileText, TrendingUp, Users, MessageCircle, Info, HelpCircle, Coins, Calendar, Shield, Globe, Activity, Bell, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SiteSearch } from './SiteSearch';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/market-intel', label: 'Market Intel', icon: TrendingUp },
  { path: '/market-pulse', label: 'Market Pulse', icon: Activity },
  { path: '/insights', label: 'Insights', icon: Globe },
  { path: '/alerts-center', label: 'Alerts', icon: Bell },
  { path: '/acquisition', label: 'Acquisition', icon: Coins },
  { path: '/tokenomics', label: 'Tokenomics', icon: Coins },
  { path: '/roadmap', label: 'Roadmap', icon: Calendar },
  { path: '/whitepaper', label: 'Whitepaper', icon: FileText },
  { path: '/community-governance', label: 'Governance', icon: Users },
  { path: '/community-voting', label: 'Voting', icon: Users },
  { path: '/community-highlights', label: 'Highlights', icon: Users },
  { path: '/testimonials', label: 'Testimonials', icon: MessageCircle },
  { path: '/about', label: 'About', icon: Info },
  { path: '/ecosystem-growth', label: 'Ecosystem', icon: Globe },
  { path: '/security-transparency', label: 'Security', icon: Shield },
  { path: '/contact', label: 'Contact', icon: MessageCircle },
  { path: '/faq', label: 'FAQ', icon: HelpCircle },
];

export function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const activeButton = container.querySelector('[data-active="true"]');
    if (activeButton) {
      activeButton.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentPath]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border shadow-lg">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center min-w-[72px] h-16 px-3 rounded-lg transition-all hover:bg-primary/10 text-muted-foreground hover:text-primary"
            aria-label="Search"
          >
            <Search className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Search</span>
          </button>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                data-active={isActive}
                className={`flex flex-col items-center justify-center min-w-[72px] h-16 px-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                }`}
                aria-label={item.label}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <SiteSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
