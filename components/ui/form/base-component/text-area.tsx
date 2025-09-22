import React, { useState } from 'react';
import { BaseInput } from '@/components/FormBuilder/types';

type TextAreaSize = 'sm' | 'md' | 'lg';

export interface TextAreaProps extends BaseInput<string> {
  label?: string;
  rows?: number;
  placeholder?: string;
}

const sizeClasses: Record<TextAreaSize, string> = {
  sm: 'text-sm py-1.5 px-3',
  md: 'text-base py-2 px-4',
  lg: 'text-lg py-2.5 px-5',
};

const TextArea: React.FC<TextAreaProps> = ({
  size = 'md',
  label,
  name = "test",
  value,
  onChange,
  disabled,
  readOnly,
  placeholder,
  rows = 3,
  className
}) => {
  const [focused, setFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? '');

  const inputId = name;
  const currentValue = value ?? internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };


  return (
    <div className="relative w-full">
      {/* Default Label */}
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-neutral-300 mb-1">
          {label}
        </label>
      )}

      <textarea
        id={inputId}
        rows={rows}
        value={currentValue}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder || 'Enter text'}
        className={`
          peer w-full bg-background text-text-primary rounded-xl
          border-b border-border
          ${currentValue ? 'border-b-2 border-brand' : ''}
          ${sizeClasses[size]}
          ${disabled ? 'bg-disabled cursor-not-allowed opacity-60' : ''}
          ${className || ''}
        `}
      />
    </div>
  );
};

export default TextArea;
