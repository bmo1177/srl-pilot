import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 glass rounded-full p-1 transition-all hover:shadow-lg hover:shadow-primary/20"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg transition-all duration-300 flex items-center justify-center ${
          theme === "dark" ? "left-7" : "left-1"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-4 w-4 text-white" />
        ) : (
          <Sun className="h-4 w-4 text-white" />
        )}
      </div>
    </button>
  );
};
