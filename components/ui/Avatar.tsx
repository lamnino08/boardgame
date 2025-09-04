
import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
}

const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'medium' }) => {
  const sizeClasses = {
    small: 'h-8 w-8',
    medium: 'h-12 w-12',
    large: 'h-16 w-16',
  };

  return (
    <img
      className={`inline-block rounded-full ${sizeClasses[size]}`}
      src={src}
      alt={alt}
    />
  );
};

export default Avatar;
