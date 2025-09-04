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
    <div className="flex min-h-screen pt-16 flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
