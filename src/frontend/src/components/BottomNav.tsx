import { useNavigate, useRouterState } from '@tanstack/react-router';

export function BottomNav() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { path: '/', emoji: '🏠', label: 'Home' },
    { path: '/market-intel', emoji: '📊', label: 'Market Intel' },
    { path: '/market-pulse', emoji: '💓', label: 'Market Pulse' },
    { path: '/alerts-center', emoji: '🔔', label: 'Alerts' },
    { path: '/tokenomics', emoji: '💰', label: 'Tokenomics' },
    { path: '/roadmap', emoji: '🗺️', label: 'Roadmap' },
    { path: '/acquisition', emoji: '🚀', label: 'Acquisition' },
    { path: '/whitepaper', emoji: '📄', label: 'Whitepaper' },
    { path: '/faq', emoji: '❓', label: 'FAQ' },
    { path: '/about', emoji: 'ℹ️', label: 'About' },
    { path: '/community-governance', emoji: '🏛️', label: 'Governance' },
    { path: '/community-voting', emoji: '🗳️', label: 'Voting' },
    { path: '/ecosystem-growth', emoji: '🌱', label: 'Ecosystem' },
    { path: '/community-highlights', emoji: '⭐', label: 'Highlights' },
    { path: '/security-transparency', emoji: '🔒', label: 'Security' },
    { path: '/contact', emoji: '📞', label: 'Contact' },
    { path: '/testimonials', emoji: '💬', label: 'Testimonials' },
    { path: '/insights', emoji: '🔍', label: 'Insights' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-scroll-container">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate({ to: item.path })}
            className={`bottom-nav-icon ${isActive(item.path) ? 'bottom-nav-icon-active' : ''}`}
            aria-label={item.label}
          >
            <span className="bottom-nav-emoji">{item.emoji}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
