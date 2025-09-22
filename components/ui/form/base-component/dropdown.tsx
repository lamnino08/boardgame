'use client'

import React, { useState, useRef, useEffect } from 'react';
import { BaseInput } from '@/components/FormBuilder/types';
import { InputSize } from './text-input';

export interface DropdownOption<T = string> {
  label: string;
  value: T;
  className?: string;
  render?: () => React.ReactNode;
  action?: React.ReactNode; // New: action for each option
}

export const sizeClasses: Record<InputSize, string> = {
  sm: 'text-sm py-[7px] px-3',
  md: 'text-base py-2 px-4',
  lg: 'text-lg py-2.5 px-5',
};

type DropdownSize = 'sm' | 'md' | 'lg';

export interface DropdownProps<T = string> extends BaseInput<T> {
  options: DropdownOption<T>[];
  label?: string;
  placeholder?: string;
  size?: DropdownSize;
  className?: string;
  disabled?: boolean;
  onBlur?: () => void;
  buttonRender?: React.ReactNode;
}

function Dropdown<T = string>({
  options,
  onChange,
  placeholder = 'Select an option',
  size = 'md',
  label,
  className,
  value,
  disabled,
  onBlur,
  buttonRender,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<T | undefined>(value);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === (value ?? internalValue));

  const handleSelect = (val: T) => {
    setInternalValue(val);
    onChange?.(val);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      className={`relative w-full ${className || ''}`}
      tabIndex={0}
      onBlur={onBlur}
    >
      {label && <label className="form-label">{label}</label>}

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={
          `input-field ${sizeClasses[size]} flex justify-between items-center px-2 ` +
          (selectedOption ? `text-text-primary ${selectedOption.className}`  : 'text-text-secondary')
        }
      >
        {buttonRender ? (
          buttonRender
        ) : (
          selectedOption?.label || placeholder
        )}
        <svg
          className={`ml-2 h-4 w-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full rounded-xl shadow-lg bg-background border border-border z-50 overflow-hidden">
          {options.map((option) => (
            <div key={String(option.value)} className="flex items-center">
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`block w-full text-left ${sizeClasses[size]} text-text-primary hover:bg-card ${option.className || ''}`}
              >
                {option.render ? option.render() : option.label}
              </button>
              {option.action && (
                <span
                  className="ml-2 flex-shrink-0 cursor-pointer"
                  onClick={e => { e.stopPropagation(); /* custom action handler if needed */ }}
                >
                  {option.action}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
