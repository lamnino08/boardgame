'use client'

import { cn } from '@/lib/utils';
import React, { useRef, useState } from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, children, className, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });
  };

  return (
    <div
      onClick={onClick}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "relative bg-card backdrop-blur-md border border-border w-full flex flex-col rounded-3xl shadow-lg p-8 transition hover:shadow-xl overflow-hidden group",
        className
      )}
    >
      {/* Light effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px at ${coords.x}px ${coords.y}px, var(--hover-gradient), transparent 80%)`,
        }}
      />
      
      {title && (
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

interface CardTitleProps {
  title: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  title,
  align = "left",
  className,
}) => {
  return (
    <h2
      className={cn(
        "text-xl font-semibold text-foreground mb-2",
        {
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
        },
        className
      )}
    >
      {title}
    </h2>
  );
};
