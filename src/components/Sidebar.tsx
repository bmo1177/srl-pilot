import { NavLink } from "react-router-dom";
import { Home, GraduationCap, Users, UserPlus, Shield, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";

export const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : true;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isExpanded));
  }, [isExpanded]);

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Students", path: "/students", icon: GraduationCap },
    { name: "Teams", path: "/teams", icon: Users },
    { name: "Join/Create", path: "/request", icon: UserPlus },
    { name: "Admin", path: "/admin", icon: Shield },
  ];

  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileOpen(false);
    }
  };

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setIsExpanded(!isExpanded);
    } else {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const sidebarWidth = isExpanded ? "w-64" : "w-20";
  const mobileSidebar = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden glass"
        aria-label="Toggle sidebar"
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen glass-strong border-r border-border/50 transition-all duration-300 flex flex-col
          ${sidebarWidth}
          lg:translate-x-0 ${mobileSidebar}
          z-40 lg:z-30
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border/30">
          <div className={`flex items-center gap-3 ${!isExpanded && "lg:justify-center"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            {isExpanded && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold gradient-text">TP Teams</h1>
                <p className="text-xs text-muted-foreground">SRL Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle */}
        <div className="hidden lg:flex justify-end p-2 border-b border-border/30">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={isExpanded}
          >
            {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-primary/20 to-accent/20 text-primary shadow-lg shadow-primary/20"
                    : "hover:bg-muted/50 text-foreground/80"
                } ${!isExpanded && "lg:justify-center lg:px-3"}`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`h-5 w-5 transition-all ${
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground group-hover:text-primary group-hover:scale-110"
                    }`}
                    aria-hidden="true"
                  />
                  {isExpanded && (
                    <span className={`font-medium ${isActive ? "text-primary" : ""}`}>
                      {item.name}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Theme Toggle at Bottom */}
        <div className="p-4 border-t border-border/30">
          <div className={`flex items-center gap-3 ${!isExpanded && "lg:justify-center"}`}>
            <ThemeToggle />
            {isExpanded && <span className="text-sm text-muted-foreground">Theme</span>}
          </div>
        </div>

        {/* Footer */}
        {isExpanded && (
          <div className="p-4 border-t border-border/30">
            <p className="text-xs text-center text-muted-foreground">
              Built with 💙 Supabase + React
            </p>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              setIsMobileOpen(false);
            }
          }}
        />
      )}
    </>
  );
};

// Export the sidebar width for layout calculations
export const getSidebarWidth = (isExpanded: boolean) => (isExpanded ? 256 : 80); // 64 = w-64 (256px), 20 = w-20 (80px)
