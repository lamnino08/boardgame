import { Inter } from "next/font/google";
import React from "react";
import { Navbar } from "@/components/Layout/nav/nav";
import Footer from "@/components/Layout/footer";
import { headers } from "next/headers";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20 items-center">
        <div className="flex flex-col items-center max-w-2xl mx-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
