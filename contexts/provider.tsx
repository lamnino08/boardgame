"use client";

import { ThemeProvider } from "@/contexts/theme-context";
import { AlertProvider } from "@/contexts/alert-context";

export function AppProvider({
  children,
}
  :
  {
    children: React.ReactNode;
  }) {
  return (
    <ThemeProvider>
      <AlertProvider>
          {children}
      </AlertProvider>
    </ThemeProvider>
  );
}
