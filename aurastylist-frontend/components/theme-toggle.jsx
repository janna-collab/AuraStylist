"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Render placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative inline-flex items-center justify-center rounded-full w-10 h-10 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-black dark:text-white transition-all duration-300 overflow-hidden"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 absolute transition-all dark:-rotate-90 dark:scale-0 rotate-0 scale-100" />
      <Moon className="h-5 w-5 absolute transition-all dark:rotate-0 dark:scale-100 rotate-90 scale-0" />
    </button>
  );
}
