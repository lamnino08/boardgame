"use client";

import { useTheme } from "@/contexts/theme-context"; // Update path if needed
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const theme = useTheme();

  return (
    <button
      onClick={theme.toggleTheme}
      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
    >
      {theme.isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};
