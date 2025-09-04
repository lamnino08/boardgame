import React from "react";
import Link from "next/link";

interface AppLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "underline" | "button" | "muted";
}

const AppLink: React.FC<AppLinkProps> = ({
  href,
  children,
  className = "",
  variant = "default",
}) => {
  const baseStyle = "transition duration-200";
  const variants: Record<string, string> = {
    default: "text-green-400 hover:text-green-300",
    underline: "text-green-400 hover:underline",
    button:
      "px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-400 font-medium",
    muted: "text-gray-400 hover:text-gray-200",
  };

  return (
    <Link href={href} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
};

export default AppLink;
