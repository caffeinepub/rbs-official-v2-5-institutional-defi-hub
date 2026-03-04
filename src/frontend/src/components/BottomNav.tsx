import { useLocation, useNavigate } from "@tanstack/react-router";
import { Bell, BookOpen, Home, TrendingUp, Users } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: TrendingUp, label: "Market", path: "/dashboard" },
  { icon: BookOpen, label: "Blog", path: "/blog" },
  { icon: Users, label: "Community", path: "/voting" },
  { icon: Bell, label: "Alerts", path: "/alerts" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <button
              type="button"
              key={path}
              onClick={() => navigate({ to: path })}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
