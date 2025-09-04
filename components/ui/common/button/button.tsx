'use client';

import React, { useState } from 'react';
import {
  SearchIcon,
  HomeIcon,
  UserIcon,
  CloudIcon,
  UploadIcon,
  TrashIcon,
  CalendarIcon,
  MessageIcon,
} from '@/components/icons';
import { ASCIILoading } from '@/components/ui/spinner';
import { Variant, Size } from '@/components/type';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ReactNode;
  outline?: boolean;
  onlyIcon?: boolean;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  danger: 'bg-danger text-white hover:bg-danger-dark',
  success: 'bg-success text-white hover:bg-success-dark',
  info: 'bg-info text-white hover:bg-info-dark',
  warning: 'bg-warning text-black hover:bg-warning-dark',
  secondary: 'bg-secondary text-white hover:bg-secondary-dark',
  outline: 'border-2 bg-transparent text-text-primary',
  inverse: 'text-text-primary',
};

const sizeStyles: Record<Size, string> = {
  sm: 'text-xs px-3 py-2',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3',
  icon: 'p-2 text-xl w-10 h-10 flex items-center justify-center',
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  onlyIcon = false, 
  loading = false,
  className,
  ...props
}) => {
  const style =variantStyles[variant];

  const base =
    `inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-app-blue-DEFAULT active:scale-95 gap-2 ${!props.disabled ? 'hover:scale-105' : ''}`;

  return (
    <button
      className={`${base} ${style} ${sizeStyles[size]} ${onlyIcon ? 'rounded-full' : ''}${className || ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      
        <>
          {icon && <span>{icon}</span>}
          {!onlyIcon && children}
          {onlyIcon && icon}
        </>
        {
          loading && (
            <ASCIILoading />
          )
        }
    </button>
  );
};

export default Button;

// Showcase with custom icons
export const ButtonShowcase = () => (
  <div className="space-y-8">
    {/* Colors Buttons */}
    <div>
      <div className="font-bold text-white mb-2">Colors Buttons</div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary">Primary</Button>
        <Button variant="danger">Danger</Button>
        <Button variant="success">Success</Button>
        <Button variant="info">Info</Button>
        <Button variant="warning">Warning</Button>
        <Button variant="secondary">Secondary</Button>
      </div>
    </div>
    {/* Outline Buttons */}
    <div>
      <div className="font-bold text-white mb-2">Outline Buttons</div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" outline>Primary</Button>
        <Button variant="danger" outline>Danger</Button>
        <Button variant="success" outline>Success</Button>
        <Button variant="info" outline>Info</Button>
        <Button variant="warning" outline>Warning</Button>
        <Button variant="secondary" outline>Secondary</Button>
      </div>
    </div>
    {/* Icon Buttons */}
    <div>
      <div className="font-bold text-white mb-2">Icon Buttons</div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" icon={SearchIcon}>Search</Button>
        <Button variant="danger" icon={HomeIcon}>Home</Button>
        <Button variant="success" icon={UserIcon}>Account</Button>
        <Button variant="info" icon={CloudIcon}>Download</Button>
        <Button variant="warning" icon={UploadIcon}>Upload</Button>
        <Button variant="secondary" icon={CalendarIcon}>Event</Button>
      </div>
    </div>
    {/* Outline Icon Buttons */}
    <div>
      <div className="font-bold text-white mb-2">Outline Icon Buttons</div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" outline icon={SearchIcon}>Search</Button>
        <Button variant="danger" outline icon={HomeIcon}>Home</Button>
        <Button variant="success" outline icon={UserIcon}>Account</Button>
        <Button variant="info" outline icon={CloudIcon}>Download</Button>
        <Button variant="warning" outline icon={UploadIcon}>Upload</Button>
        <Button variant="secondary" outline icon={CalendarIcon}>Event</Button>
      </div>
    </div>
    {/* Only Icon Buttons */}
    <div>
      <div className="font-bold text-white mb-2">Only Icon Buttons</div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" size="icon" onlyIcon icon={SearchIcon} />
        <Button variant="danger" size="icon" onlyIcon icon={HomeIcon} />
        <Button variant="success" size="icon" onlyIcon icon={UserIcon} />
        <Button variant="info" size="icon" onlyIcon icon={CloudIcon} />
        <Button variant="warning" size="icon" onlyIcon icon={UploadIcon} />
        <Button variant="secondary" size="icon" onlyIcon icon={CalendarIcon} />
      </div>
    </div>
    {/* Only Outline Icon Buttons */}
    <div>
      <div className="font-bold text-white mb-2">Only Outline Icon Buttons</div>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" outline size="icon" onlyIcon icon={SearchIcon} />
        <Button variant="danger" outline size="icon" onlyIcon icon={HomeIcon} />
        <Button variant="success" outline size="icon" onlyIcon icon={UserIcon} />
        <Button variant="info" outline size="icon" onlyIcon icon={CloudIcon} />
        <Button variant="warning" outline size="icon" onlyIcon icon={UploadIcon} />
        <Button variant="secondary" outline size="icon" onlyIcon icon={CalendarIcon} />
      </div>
    </div>
  </div>
);

// Example trigger loading
export const ButtonLoadingDemo = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex gap-4">
      <Button
        variant="primary"
        loading={loading}
        icon={SearchIcon}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        Load Data
      </Button>
      <Button
        variant="danger"
        loading={loading}
        icon={TrashIcon}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 2000);
        }}
      >
        Delete Data
      </Button>
    </div>
  );
};