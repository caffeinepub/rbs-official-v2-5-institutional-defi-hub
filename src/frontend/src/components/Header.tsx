import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Menu, X, ChevronDown, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SiteSearch } from './SiteSearch';

export function Header() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNavItems = [
    { path: '/', label: 'Home' },
    { path: '/tokenomics', label: 'Tokenomics' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/whitepaper', label: 'Whitepaper' },
  ];

  const communityItems = [
    { path: '/community-governance', label: 'Governance' },
    { path: '/community-voting', label: 'Voting' },
    { path: '/community-highlights', label: 'Highlights' },
    { path: '/testimonials', label: 'Testimonials' },
  ];

  const resourcesItems = [
    { path: '/market-intel', label: 'Market Intel' },
    { path: '/market-pulse', label: 'Market Pulse' },
    { path: '/insights', label: 'Insights' },
    { path: '/faq', label: 'FAQ' },
  ];

  const moreItems = [
    { path: '/about', label: 'About' },
    { path: '/ecosystem-growth', label: 'Ecosystem' },
    { path: '/security-transparency', label: 'Security' },
    { path: '/contact', label: 'Contact' },
    { path: '/alerts-center', label: 'Alerts Center' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-lg border-b border-primary/10'
          : 'bg-white/95 backdrop-blur-md border-b border-primary/5'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 group"
            aria-label="RBS Home"
          >
            <div className="relative h-12 w-12 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img
                src="/assets/IMG_20250821_154306_073.jpg"
                alt="RBS Logo"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                RBS
              </h1>
              <p className="text-xs text-muted-foreground">Return. Be Superior.</p>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                variant="ghost"
                className={`font-semibold transition-all ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.label}
              </Button>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-semibold text-foreground hover:text-primary hover:bg-primary/5"
                >
                  Community <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {communityItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate({ to: item.path })}
                    className={`cursor-pointer ${
                      isActive(item.path) ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-semibold text-foreground hover:text-primary hover:bg-primary/5"
                >
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {resourcesItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate({ to: item.path })}
                    className={`cursor-pointer ${
                      isActive(item.path) ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="font-semibold text-foreground hover:text-primary hover:bg-primary/5"
                >
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreItems.map((item) => (
                  <DropdownMenuItem
                    key={item.path}
                    onClick={() => navigate({ to: item.path })}
                    className={`cursor-pointer ${
                      isActive(item.path) ? 'bg-primary/10 text-primary' : ''
                    }`}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={() => setIsSearchOpen(true)}
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary hover:bg-primary/5"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              onClick={() => navigate({ to: '/acquisition' })}
              className="ml-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Get RBS
            </Button>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              onClick={() => setIsSearchOpen(true)}
              variant="ghost"
              size="icon"
              className="text-foreground hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-foreground hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-primary/10 bg-white/98 backdrop-blur-xl">
            <nav className="flex flex-col gap-2">
              {[...mainNavItems, ...communityItems, ...resourcesItems, ...moreItems].map((item) => (
                <Button
                  key={item.path}
                  onClick={() => {
                    navigate({ to: item.path });
                    setIsMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className={`justify-start font-semibold ${
                    isActive(item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-foreground hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.label}
                </Button>
              ))}
              <Button
                onClick={() => {
                  navigate({ to: '/acquisition' });
                  setIsMobileMenuOpen(false);
                }}
                className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              >
                Get RBS
              </Button>
            </nav>
          </div>
        )}
      </div>

      <SiteSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
