import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  ChevronDown,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { useReliableAuth } from "../hooks/useReliableAuth";

type NavLeaf = { label: string; path: string };
type NavGroup = { label: string; children: NavLeaf[] };
type NavItem = NavLeaf | NavGroup;

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  {
    label: "Token",
    children: [
      { label: "Tokenomics", path: "/tokenomics" },
      { label: "Whitepaper", path: "/whitepaper" },
      { label: "Roadmap", path: "/roadmap" },
    ],
  },
  {
    label: "Market",
    children: [
      { label: "Market Dashboard", path: "/dashboard" },
      { label: "Market Intelligence", path: "/market-intel" },
      { label: "Live Prices", path: "/live-price" },
      { label: "Market Pulse", path: "/market-pulse" },
      { label: "AI Sentiment", path: "/sentiment" },
      { label: "Advanced Analytics", path: "/analytics" },
    ],
  },
  {
    label: "Community",
    children: [
      { label: "Governance", path: "/governance" },
      { label: "Community Voting", path: "/voting" },
      { label: "Leaderboard", path: "/leaderboard" },
      { label: "Highlights", path: "/community" },
      { label: "Testimonials", path: "/testimonials" },
    ],
  },
  {
    label: "Acquire",
    children: [
      { label: "Acquisition", path: "/acquisition" },
      { label: "Airdrop & Presale Hub", path: "/airdrop-presale" },
    ],
  },
  {
    label: "Resources",
    children: [
      { label: "Developer Blog", path: "/blog" },
      { label: "Staking Calculator", path: "/staking" },
      { label: "Partners", path: "/partners" },
      { label: "Ecosystem", path: "/ecosystem" },
      { label: "Security", path: "/security" },
      { label: "Insights", path: "/insights" },
      { label: "FAQ", path: "/faq" },
      { label: "Contact", path: "/contact" },
    ],
  },
  { label: "Alerts", path: "/alerts" },
];

function isGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, isAuthenticated, isDisabled, handleLogin, handleLogout } =
    useReliableAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await handleLogout();
    } else {
      await handleLogin();
    }
  };

  const handleNav = (path: string) => {
    navigate({ to: path });
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("/")}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/rbs-logo-nav-transparent.dim_200x200.png"
              alt="RBS Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              RBS<span className="text-primary">Superior</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              isGroup(item) ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    {item.label}
                    <ChevronDown className="h-3 w-3" />
                  </button>
                  {openDropdown === item.label && (
                    <div className="absolute top-full left-0 mt-1 w-52 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
                      {item.children.map((child) => (
                        <button
                          type="button"
                          key={child.path}
                          onClick={() => handleNav(child.path)}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            isActive(child.path)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  key={(item as NavLeaf).path}
                  onClick={() => handleNav((item as NavLeaf).path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive((item as NavLeaf).path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              ),
            )}
          </nav>

          {/* Auth Button */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && identity && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Connected</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleAuth}
              disabled={isDisabled}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                isAuthenticated
                  ? "bg-muted hover:bg-muted/80 text-foreground"
                  : "bg-primary hover:bg-primary/90 text-primary-foreground"
              } disabled:opacity-50`}
            >
              {isDisabled ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isAuthenticated ? (
                <LogOut className="h-4 w-4" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isDisabled
                ? "Connecting..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) =>
              isGroup(item) ? (
                <div key={item.label}>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenDropdown(
                        openDropdown === item.label ? null : item.label,
                      )
                    }
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <button
                          type="button"
                          key={child.path}
                          onClick={() => handleNav(child.path)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            isActive(child.path)
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  key={(item as NavLeaf).path}
                  onClick={() => handleNav((item as NavLeaf).path)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive((item as NavLeaf).path)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {item.label}
                </button>
              ),
            )}
            <div className="pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleAuth}
                disabled={isDisabled}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isAuthenticated
                    ? "bg-muted hover:bg-muted/80 text-foreground"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                } disabled:opacity-50`}
              >
                {isDisabled ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isAuthenticated ? (
                  <LogOut className="h-4 w-4" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {isDisabled
                  ? "Connecting..."
                  : isAuthenticated
                    ? "Logout"
                    : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
