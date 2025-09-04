"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie"; // Client-side cookies library

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null); // null indicates the initial state

  useEffect(() => {
    const root = window.document.documentElement;

    // Get the theme from cookies or system preference
    const storedTheme = Cookies.get("theme");
    if (storedTheme) {
      const isDark = storedTheme === "dark";
      setIsDarkMode(isDark);
      root.classList.toggle("dark", isDark);
    } else {
      // Fallback to system preference
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(prefersDarkMode);
      root.classList.toggle("dark", prefersDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode === null) return; // Prevent toggling before theme is initialized

    const root = window.document.documentElement;
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    root.classList.toggle("dark", newTheme);
    Cookies.set("theme", newTheme ? "dark" : "light", { expires: 365 });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode: isDarkMode ?? false, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
