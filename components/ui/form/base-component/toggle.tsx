import React, { useState } from 'react';
import { BaseInput } from '@/components/FormBuilder/types';

export interface ToggleProps extends BaseInput<boolean> {
  color?: 'blue' | 'red';
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  value = false,
  disabled = false,
  color = 'blue',
  onChange,
  className,
}) => {
  const [internalChecked, setInternalChecked] = useState(value);

  const handleToggle = () => {
    if (disabled) return;
    const newVal = !internalChecked;
    setInternalChecked(newVal);
    onChange?.(newVal);
  };

  const gradientClasses = {
    blue: internalChecked ? 'bg-success' : 'bg-disabled',
    red: internalChecked ? 'bg-danger' : 'bg-disabled',
  };

  return (
    <label
      className={`flex items-center space-x-4 cursor-pointer select-none transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className || ''}`}
    >
      {label && <span className="text-text-primary text-sm">{label}</span>}
      <div
        onClick={handleToggle}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${gradientClasses[color]}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transform transition-transform duration-300 ${internalChecked ? 'translate-x-6' : ''
            }`}
        >
          {internalChecked && (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </span>
      </div>
    </label>
  );
};
