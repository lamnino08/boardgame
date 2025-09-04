'use client'

import React, { useState } from 'react';
import {Card} from '@/components/ui/Card';
import { BaseInput } from '@/components/FormBuilder/types';
import { sizeClasses } from '@/components/ui/form/base-component/text-input';

type DropdownSize = 'sm' | 'md' | 'lg';

interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownProps extends BaseInput<string> {
  options: DropdownOption[];
  label?: string;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onChange,
  placeholder = 'Select an option',
  size = 'md',
  label,
  className,
  value,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>(value || '');

  const selectedOption = options.find((opt) => opt.value === (value ?? internalValue));

  const handleSelect = (val: string) => {
    setInternalValue(val);
    onChange?.(val);
    setIsOpen(false);
  };

  const hasValue = Boolean(selectedOption);

  return (
    <div className={`relative w-full ${className || ''}`}>
      {/* Normal Label (non-floating) */}
      {label && (
        <label className="form-label">{label}</label>
      )}

      {/* Trigger Button */}
      <button
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          input-field
          ${sizeClasses[size]}
          flex justify-between items-center px-2 
          ${selectedOption ? 'text-text-primary' : 'text-text-secondary'}
        `}
      >
        {selectedOption?.label || placeholder}

        <svg
          className={`ml-2 h-4 w-4 text-neutral-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'
            }`}
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

      {/* Dropdown List */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 mt-1 w-full rounded-xl shadow-lg
            bg-background border border-border z-50
          "
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className="
                block w-full text-left px-4 py-2 text-sm text-text-primary
                hover:bg-card transition-colors
              "
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default Dropdown;

// Showcase
export const DropdownShowcase = () => {
  const [selected, setSelected] = useState('');
  const options = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ];

  return (
    <></>
    // <Card className="flex flex-col gap-4 p-6">
    //   <Dropdown name='hhh' label="Small Dropdown" size="sm" options={options} onChange={setSelected} placeholder="Pick one" />
    //   <Dropdown name='hhh' label="Medium Dropdown" options={options} onChange={setSelected} placeholder="Pick color" />
    //   <Dropdown name='hhh' label="Large Dropdown" size="lg" options={options} onChange={setSelected} placeholder="Choose size" />
    //   <Dropdown name='hhh' label="Floating Dropdown" options={options} onChange={setSelected} />
    // </Card>
  );
};
