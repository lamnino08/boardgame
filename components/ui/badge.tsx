// components/ui/badge.tsx
'use client';

import React from 'react';
import { Variant, Size } from '@/components/type';
import Button from '@/components/ui/common/button/button';
import icons from '@/components/icons';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: Size,
  dot?: {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    count: number;
    icon: React.ReactNode;
  }
  className?: string; // Class for the wrapper if badge is absolutely positioned
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  dot,
  className,
  ...props
}) => {

  const dotClassName = {
    base: `absolute flex items-center justify-center rounded-full text-[0.6rem] leading-none bg-danger text-white p-1`,
    positionDotSytles: {
      'top-right': 'top-1 right-1 -translate-y-1/2 translate-x-1/2',
      'top-left': 'top-1 left-1 -translate-y-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-0 right-0 translate-y-1/2 translate-x-1/2',
      'bottom-left': 'bottom-0 left-0 translate-y-1/2 -translate-x-1/2',
    }
  }

  return (
    <span className='relative '>
      {(dot && dot.count > 0) && (
        <span className={`${dotClassName.base} ${dotClassName.positionDotSytles[dot.position || 'top-right']}`}>
          {dot.count}
        </span>
      )}
      <Button variant={variant} icon={dot?.icon} className={`${!dot && 'py-0 px-1'} ${className}`} size={size} {...props}>
        {children}
      </Button>
    </span>
  );
};

export default Badge;


export const BadgeShowCase = () => {
  return (
    <div className="p-8 space-y-8 text-white">
      <h2 className="text-xl font-bold">Badge Showcase</h2>

      {/* 1. Simple Variants */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success">Success</Badge>
        <Badge variant="info">Info</Badge>
        <Badge variant="warning">Warning</Badge>
        <Badge variant="danger">Danger</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>

      {/* 2. Sizes */}
      <div className="flex gap-4 flex-wrap items-center">
        <Badge size="sm" variant="primary" dot={{ count: 5, icon: icons.bell }}>Small</Badge>
        <Badge size="md" variant="success" dot={{ count: 2, icon: icons.bell }}>Medium</Badge>
        <Badge size="lg" variant="danger" dot={{ count: 0, icon: icons.bell }}>Large</Badge>
      </div>

      {/* 3. Count Badges (Notifications) */}
      <div className="flex gap-8 items-center">
        <Badge dot={{ count: 5, icon: icons.bell }} variant="primary" size='sm' />
        <Badge dot={{ count: 5, icon: icons.bell }} variant="primary" size='md' />
        <Badge dot={{ count: 5, icon: icons.bell }} variant="secondary" size='lg' />
      </div>
    </div>
  );
}
