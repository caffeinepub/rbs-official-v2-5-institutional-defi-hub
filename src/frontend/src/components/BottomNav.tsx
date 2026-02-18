import { Link, useLocation } from '@tanstack/react-router';
import { Home, FileText, TrendingUp, Users, BarChart3, Newspaper, Bell } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/whitepaper', icon: FileText, label: 'Whitepaper' },
    { path: '/market-intel', icon: TrendingUp, label: 'Intel' },
    { path: '/community-voting', icon: Users, label: 'Voting' },
    { path: '/advanced-analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/crypto-news', icon: Newspaper, label: 'News' },
    { path: '/alerts-center', icon: Bell, label: 'Alerts' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-gold/20 lg:hidden">
      <div className="flex items-center justify-around px-2 py-2 overflow-x-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-w-[60px] px-2 py-2 rounded-lg transition-all duration-200 mex-hover-lift ${
                active
                  ? 'bg-gold/10 text-gold'
                  : 'text-gray-600 hover:bg-gold/5 hover:text-gold'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${active ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
