import React from "react";
import { Navbar } from "@/components/Layout/nav/nav";
import Footer from "@/components/Layout/footer";
import { headers } from "next/headers";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-black p-2 font-mono text-green-300">
            <div className="flex flex-col items-center justify-center w-full max-w-xl">
                {children}
            </div>
        </div>
    );
}
