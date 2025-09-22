"use client";

import { MoonIcon, SunIcon } from "@/components/icons";
import { useTheme } from "@/contexts/theme-context"; // Update path if needed

export const ThemeToggle = () => {
  const theme = useTheme();

  return (
    <button
      onClick={theme.toggleTheme}
      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
    >
      {theme.isDarkMode ? SunIcon : MoonIcon}
    </button>
  );
};
