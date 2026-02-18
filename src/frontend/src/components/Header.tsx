import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useReliableAuth } from '@/hooks/useReliableAuth';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { handleAuth, isAuthenticated, isDisabled, loginStatus } = useReliableAuth();

  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/whitepaper', label: 'Whitepaper' },
    { path: '/roadmap', label: 'Roadmap' },
    { path: '/tokenomics', label: 'Tokenomics' },
  ];

  const resourcesLinks = [
    { path: '/acquisition', label: 'Acquisition Portal' },
    { path: '/adult-form', label: 'Adult Form' },
    { path: '/faq', label: 'FAQ' },
    { path: '/contact', label: 'Contact' },
  ];

  const communityLinks = [
    { path: '/community-governance', label: 'Governance' },
    { path: '/community-voting', label: 'Voting' },
    { path: '/community-highlights', label: 'Highlights' },
    { path: '/ecosystem-growth', label: 'Ecosystem' },
    { path: '/security-transparency', label: 'Security' },
    { path: '/testimonials', label: 'Testimonials' },
  ];

  const analyticsLinks = [
    { path: '/market-intel', label: 'Market Intel' },
    { path: '/market-pulse', label: 'Market Pulse' },
    { path: '/live-price', label: 'Live Price' },
    { path: '/crypto-news', label: 'Crypto News' },
    { path: '/advanced-analytics', label: 'Advanced Analytics' },
    { path: '/alerts-center', label: 'Alerts Center' },
    { path: '/insights', label: 'Insights' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gold/20">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 mex-hover-lift">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gold to-gold/60 flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-poppins font-bold metallic-text-hero">RBS</span>
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium mex-hover-lift ${
                  isActive(link.path)
                    ? 'bg-gold/10 text-gold'
                    : 'text-gray-700 hover:bg-gold/5 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 hover:bg-gold/5 hover:text-gold mex-hover-lift"
                >
                  Resources
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {resourcesLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link
                      to={link.path}
                      className={`w-full ${isActive(link.path) ? 'bg-gold/10 text-gold' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 hover:bg-gold/5 hover:text-gold mex-hover-lift"
                >
                  Community
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {communityLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link
                      to={link.path}
                      className={`w-full ${isActive(link.path) ? 'bg-gold/10 text-gold' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-4 py-2 text-gray-700 hover:bg-gold/5 hover:text-gold mex-hover-lift"
                >
                  Analytics
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {analyticsLinks.map((link) => (
                  <DropdownMenuItem key={link.path} asChild>
                    <Link
                      to={link.path}
                      className={`w-full ${isActive(link.path) ? 'bg-gold/10 text-gold' : ''}`}
                    >
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={handleAuth}
              disabled={isDisabled}
              className={`ml-4 mex-hover-lift transition-all duration-300 ${
                isAuthenticated
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  : 'bg-gold hover:bg-gold/90 text-black'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {text}
            </Button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gold/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6 text-gold" /> : <Menu className="h-6 w-6 text-gold" />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? 'bg-gold/10 text-gold'
                    : 'text-gray-700 hover:bg-gold/5 hover:text-gold'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gold/20">
              <p className="px-4 py-2 text-sm font-semibold text-gray-500">Resources</p>
              {resourcesLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-gold/10 text-gold'
                      : 'text-gray-700 hover:bg-gold/5 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-gold/20">
              <p className="px-4 py-2 text-sm font-semibold text-gray-500">Community</p>
              {communityLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-gold/10 text-gold'
                      : 'text-gray-700 hover:bg-gold/5 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-2 border-t border-gold/20">
              <p className="px-4 py-2 text-sm font-semibold text-gray-500">Analytics</p>
              {analyticsLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-gold/10 text-gold'
                      : 'text-gray-700 hover:bg-gold/5 hover:text-gold'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="pt-4">
              <Button
                onClick={handleAuth}
                disabled={isDisabled}
                className={`w-full transition-all duration-300 ${
                  isAuthenticated
                    ? 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    : 'bg-gold hover:bg-gold/90 text-black'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {text}
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
