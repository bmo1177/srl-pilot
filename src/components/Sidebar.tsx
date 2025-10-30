import { NavLink } from "react-router-dom";
import { Home, GraduationCap, Users, UserPlus, Shield, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    handleResize();
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
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass p-2 rounded-lg hover:bg-primary/10 transition-all"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen glass-strong border-r border-border/50 transition-all duration-300 z-40 flex flex-col ${
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border/30">
          <div className={`flex items-center gap-3 ${!isOpen && "lg:justify-center"}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold gradient-text">TP Teams</h1>
                <p className="text-xs text-muted-foreground">SRL Platform</p>
              </div>
            )}
          </div>
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
                } ${!isOpen && "lg:justify-center lg:px-3"}`
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
                  />
                  {isOpen && (
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
          <div className={`flex items-center gap-3 ${!isOpen && "lg:justify-center"}`}>
            <ThemeToggle />
            {isOpen && <span className="text-sm text-muted-foreground">Theme</span>}
          </div>
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-border/30">
            <p className="text-xs text-center text-muted-foreground">
              Built with 💙 Supabase + React
            </p>
          </div>
        )}
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
