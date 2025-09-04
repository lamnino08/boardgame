'use client';

import React from 'react';
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: number;
  className?: string;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const Avatar: React.FC<AvatarProps> = ({ src, name = '', size = 40, className }) => {
  return (
    <div
      className={`rounded-full bg-background text-text-primary flex items-center justify-center overflow-hidden select-none ${className}`}
      style={{ width: size, height: size, fontSize: size / 2 }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      ) : (
        <span>{getInitials(name || 'U')}</span>
      )}
    </div>
  );
};

export default Avatar;
