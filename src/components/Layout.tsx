import { ReactNode, useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const SIDEBAR_STORAGE_KEY = "sidebar-expanded";

export const Layout = ({ children }: LayoutProps) => {
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : true;
  });

  // Listen to storage changes to sync sidebar state
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored) {
        setIsExpanded(JSON.parse(stored));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Check for changes periodically (for same-tab updates)
    const interval = setInterval(handleStorageChange, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Calculate margin based on sidebar state
  const mainMargin = isExpanded ? "lg:ml-64" : "lg:ml-20";

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />
      <main className={`flex-1 ml-0 ${mainMargin} transition-all duration-300 pt-16 lg:pt-0`}>
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
};
