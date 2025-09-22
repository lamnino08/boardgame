"use client";

import { ThemeProvider } from "@/contexts/theme-context";
import { AlertProvider } from "@/contexts/alert-context";
import { ModalProvider } from "@/contexts/modal-context";

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
        <ModalProvider>
          {children}
        </ModalProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}
