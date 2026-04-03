import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  BarChart2,
  BookOpen,
  ChevronDown,
  Coins,
  Globe,
  Layers,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  PieChart,
  ScrollText,
  Settings,
  Shield,
  Star,
  TrendingUp,
  User,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAccountCount } from "../hooks/useAccountCount";
import { useActor } from "../hooks/useActor";
import { useReliableAuth } from "../hooks/useReliableAuth";
import LivePriceTicker from "./LivePriceTicker";
import { getLocalProfile } from "./ProfileSetupModal";

type NavLeaf = {
  label: string;
  path: string;
  icon?: React.ElementType;
  desc?: string;
};
type NavGroup = {
  label: string;
  children: NavLeaf[];
  icon?: React.ElementType;
};
type NavItem = NavLeaf | NavGroup;

const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  {
    label: "Token",
    icon: Coins,
    children: [
      {
        label: "Tokenomics",
        path: "/tokenomics",
        icon: PieChart,
        desc: "Supply & distribution",
      },
      {
        label: "Whitepaper",
        path: "/whitepaper",
        icon: ScrollText,
        desc: "Technical documentation",
      },
      {
        label: "Roadmap",
        path: "/roadmap",
        icon: Activity,
        desc: "Development timeline",
      },
    ],
  },
  { label: "Trading Tools", path: "/trading-tools" },
  {
    label: "Market",
    icon: TrendingUp,
    children: [
      {
        label: "RBS Price",
        path: "/rbs-price",
        icon: Coins,
        desc: "Live token price",
      },
      {
        label: "Market Intelligence",
        path: "/market-intel",
        icon: Zap,
        desc: "G-Man AI signals",
      },
      {
        label: "Funding Rates",
        path: "/funding-rates",
        icon: BarChart2,
        desc: "Futures funding",
      },
    ],
  },
  { label: "Acquire", path: "/acquisition" },
  {
    label: "Resources",
    icon: BookOpen,
    children: [
      {
        label: "Staking Calculator",
        path: "/staking",
        icon: BarChart2,
        desc: "Estimate rewards",
      },
      {
        label: "Partners",
        path: "/partners",
        icon: Users,
        desc: "Our ecosystem",
      },
      {
        label: "Security",
        path: "/security",
        icon: Shield,
        desc: "Audits & safety",
      },
      {
        label: "Contact",
        path: "/contact",
        icon: Settings,
        desc: "Get in touch",
      },
    ],
  },
];

function isGroup(item: NavItem): item is NavGroup {
  return "children" in item;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { identity, isAuthenticated, isDisabled, handleLogin, handleLogout } =
    useReliableAuth();
  const { actor, isFetching: actorFetching } = useActor();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { count: memberCount, isLoaded: memberCountLoaded } = useAccountCount();
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const principalId = useMemo(
    () => identity?.getPrincipal().toString() ?? "",
    [identity],
  );

  const { data: backendProfile } = useQuery({
    queryKey: ["callerProfile", principalId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  const localProfile = useMemo(() => {
    if (!principalId) return null;
    return getLocalProfile(principalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalId]);

  const displayName =
    (backendProfile as any)?.displayName ?? (backendProfile as any)?.name ?? "";
  const username =
    (backendProfile as any)?.username ?? localProfile?.username ?? "";
  const avatarUrl = (() => {
    const bu = (backendProfile as any)?.avatarUrl;
    return (Array.isArray(bu) ? bu[0] : bu) ?? localProfile?.avatarUrl ?? null;
  })();

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
    setProfileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;
  const isGroupActive = (children: NavLeaf[]) =>
    children.some((c) => location.pathname === c.path);

  const handleDropdownEnter = (label: string) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(14, 165, 233, 0.12)",
        boxShadow:
          "0 1px 16px rgba(0,0,0,0.07), 0 0 0 1px rgba(14,165,233,0.04)",
      }}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(to right, #0ea5e9, #22d3ee)",
        }}
      />
      <LivePriceTicker />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.home.link"
            onClick={() => handleNav("/")}
            className="flex items-center gap-2.5 group flex-shrink-0"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0px rgba(14,165,233,0)",
                    "0 0 16px rgba(14,165,233,0.6)",
                    "0 0 0px rgba(14,165,233,0)",
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="h-9 w-9 rounded-full bg-sky-500 flex items-center justify-center text-white font-black text-sm ring-2 ring-sky-100 group-hover:ring-sky-300 transition-all"
              >
                RBS
              </motion.div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div className="leading-tight">
              <div>
                <span className="font-bold text-base text-gray-900">RBS</span>
                <span className="font-bold text-base text-sky-500">
                  Superior
                </span>
              </div>
              {/* Live member count */}
              <div className="flex items-center gap-1 mt-0.5">
                <motion.span
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
                />
                <span className="text-[10px] font-medium text-gray-500 leading-none">
                  {memberCountLoaded
                    ? `${memberCount.toLocaleString()} Members`
                    : "Loading..."}
                </span>
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) =>
              isGroup(item) ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(item.label)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isGroupActive(item.children)
                        ? "text-sky-600 bg-sky-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <span className="relative flex items-center gap-1">
                      {isGroupActive(item.children) && (
                        <span className="absolute -top-0.5 -right-1.5 w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                      {item.label}
                    </span>
                    <motion.span
                      animate={{
                        rotate: openDropdown === item.label ? 180 : 0,
                      }}
                      transition={{ duration: 0.18 }}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1.5 rounded-2xl shadow-xl py-2 z-50 min-w-[220px]"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(240,249,255,0.98) 0%, rgba(255,255,255,0.99) 50%)",
                          border: "1px solid rgba(14,165,233,0.14)",
                          boxShadow:
                            "0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px rgba(14,165,233,0.06)",
                        }}
                        onMouseEnter={() => handleDropdownEnter(item.label)}
                        onMouseLeave={handleDropdownLeave}
                      >
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          return (
                            <button
                              type="button"
                              key={child.path}
                              data-ocid={`nav.${child.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.link`}
                              onClick={() => handleNav(child.path)}
                              className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors group/item mx-1 rounded-xl ${
                                isActive(child.path)
                                  ? "text-sky-600 bg-sky-50"
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                              style={{ width: "calc(100% - 8px)" }}
                            >
                              {Icon && (
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isActive(child.path)
                                      ? "bg-sky-100"
                                      : "bg-gray-100 group-hover/item:bg-sky-50"
                                  }`}
                                >
                                  <Icon
                                    className={`h-3.5 w-3.5 ${
                                      isActive(child.path)
                                        ? "text-sky-500"
                                        : "text-gray-500 group-hover/item:text-sky-500"
                                    }`}
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-medium leading-none mb-0.5">
                                  {child.label}
                                </p>
                                {child.desc && (
                                  <p className="text-[11px] text-gray-400 truncate">
                                    {child.desc}
                                  </p>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  type="button"
                  key={(item as NavLeaf).path}
                  data-ocid={`nav.${(item as NavLeaf).label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.link`}
                  onClick={() => handleNav((item as NavLeaf).path)}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive((item as NavLeaf).path)
                      ? "text-sky-600 bg-sky-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                  {isActive((item as NavLeaf).path) && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute bottom-1 left-3 right-3 h-0.5 rounded-full bg-sky-500"
                    />
                  )}
                </button>
              ),
            )}
          </nav>

          {/* Auth / Profile */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && (displayName || username) ? (
              <div className="relative">
                <button
                  type="button"
                  data-ocid="nav.profile.button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-100 hover:border-sky-300 bg-white hover:bg-sky-50 transition-all shadow-sm"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-sky-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-sky-200">
                      {(displayName || username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-gray-800 max-w-[100px] truncate">
                    {username ? `@${username}` : displayName}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-400" />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full right-0 mt-2 w-48 rounded-2xl shadow-xl py-2 z-50"
                      style={{
                        background: "rgba(255,255,255,0.99)",
                        border: "1px solid rgba(14,165,233,0.14)",
                        boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
                      }}
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {displayName}
                        </p>
                        {username && (
                          <p className="text-xs text-sky-500 truncate">
                            @{username}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        data-ocid="nav.profile.link"
                        onClick={() => handleNav("/profile")}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-sky-400" /> My Profile
                      </button>
                      <div className="border-t border-gray-100 mx-2 my-1" />
                      <button
                        type="button"
                        data-ocid="nav.logout.button"
                        onClick={handleAuth}
                        disabled={isDisabled}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-b-xl"
                      >
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={{
                  scale: 1.03,
                  filter: "drop-shadow(0 0 12px rgba(14,165,233,0.55))",
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <button
                  type="button"
                  data-ocid="nav.auth.button"
                  onClick={handleAuth}
                  disabled={isDisabled}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white transition-all disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                    boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
                  }}
                >
                  {isDisabled ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogIn className="h-4 w-4" />
                  )}
                  {isDisabled ? "Connecting..." : "Sign In"}
                </button>
              </motion.div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.99)",
              borderTop: "1px solid rgba(14,165,233,0.1)",
            }}
          >
            <div className="max-h-[75vh] overflow-y-auto px-4 py-3 space-y-1">
              {/* Mobile user card */}
              {isAuthenticated && (displayName || username) && (
                <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-2xl mb-3 border border-sky-100">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold">
                      {(displayName || username).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {displayName}
                    </p>
                    {username && (
                      <p className="text-xs text-sky-500">@{username}</p>
                    )}
                  </div>
                </div>
              )}

              {navItems.map((item, navIdx) =>
                isGroup(item) ? (
                  <motion.div
                    key={item.label}
                    className="mb-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navIdx * 0.05, duration: 0.25 }}
                  >
                    <div className="px-3 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      {item.label}
                    </div>
                    {item.children.map((child) => (
                      <button
                        type="button"
                        key={child.path}
                        onClick={() => handleNav(child.path)}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                          isActive(child.path)
                            ? "text-sky-600 bg-sky-50 font-medium"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {child.label}
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={(item as NavLeaf).path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navIdx * 0.05, duration: 0.25 }}
                  >
                    <button
                      type="button"
                      onClick={() => handleNav((item as NavLeaf).path)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive((item as NavLeaf).path)
                          ? "text-sky-600 bg-sky-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  </motion.div>
                ),
              )}

              {/* Mobile Auth row */}
              <div className="pt-3 border-t border-gray-100 space-y-1">
                {isAuthenticated && (
                  <button
                    type="button"
                    onClick={() => handleNav("/profile")}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 text-sky-400" /> My Profile
                  </button>
                )}
                <button
                  type="button"
                  data-ocid="nav.mobile.auth.button"
                  onClick={handleAuth}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isAuthenticated
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-sky-500 text-white hover:bg-sky-600"
                  }`}
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
                      : "Sign In"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
