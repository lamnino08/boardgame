import { Card } from "@/components/ui/Card";
import React from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center sm:w-4/5 lg:w-1/2 xl:w-1/3 2xl:w-1/4 mx-auto">
      <Link href="/" className="mb-8 text-4xl font-bold text-text-primary">
        24<span className="text-green-500">♥</span>News
      </Link>
      <Card>
        {children}
      </Card>
    </div>
  );
}
