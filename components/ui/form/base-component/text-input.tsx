'use client'
import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from '@/components/icons';
import { BaseInput } from '@/components/FormBuilder/types';

type InputSize = 'sm' | 'md' | 'lg';
type Variant = 'default' | 'floating';

export interface TextInputProps extends BaseInput<string> {
  type?: 'text' | 'email' | 'password' | 'number';
  size?: InputSize;
  variant?: Variant;
  placeholder: string;
}

export const sizeClasses: Record<InputSize, string> = {
  sm: 'text-sm py-1.5 px-3',
  md: 'text-base py-2 px-4',
  lg: 'text-lg py-2.5 px-5',
};

export const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  value = '',
  onChange,
  placeholder,
  type = 'text',
  size = 'md',
  variant = 'default',
  disabled,
  readOnly,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [internalValue, setInternalValue] = useState(value ?? '');

  const inputId = `input-${name}`;

  const isPassword = type === 'password';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
    setInternalValue(e.target.value);
  };

  return (
    <div className="relative w-full">
      {label && variant === 'default' && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}

      <input
        id={inputId}
        name={name}
        type={isPassword && showPassword ? 'text' : type}
        value={internalValue}
        onChange={handleChange}
        placeholder={(variant === 'floating' ? '' : placeholder || 'Enter your text')}
        disabled={disabled}
        readOnly={readOnly}
        className={`
            input-field peer
            ${isPassword ? 'pr-12' : ''}
            ${sizeClasses[size]}
            ${disabled ? 'bg-disabled cursor-not-allowed opacity-60' : ''}
            ${className || ''}
          `}
      />

      {/* Floating label */}
      {label && variant === 'floating' && (
        <label
          htmlFor={inputId}
          className={`
              absolute left-4 text-text-primary text-sm ${internalValue ? '-top-3' : 'top-1/2 text-text-secondary'} transform -translate-y-1/2 
              transition-all duration-150 pointer-events-none
              peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-text-secondary
              peer-placeholder-shown:translate-y-[-50%]
              peer-focus:-top-3 peer-focus:text-text-primary
            `}
        >
          {label}
        </label>
      )}

      {/* Toggle password */}
      {isPassword && (
        <button
          type="button"
          className={`absolute right-3 ${variant === 'default' ? 'top-2/3' : 'top-1/2'} -translate-y-1/2 text-text-secondary hover:text-text-primary`}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? EyeOffIcon : EyeIcon}
        </button>
      )}
    </div>
  );
};

export const TextInputShowcase = () => (
  // <Card className="flex flex-col gap-6 p-6">
    {/* <TextInput size="lg" label="Large Input" />
    <TextInput label="Default Input" />
    <TextInput size="sm" label="Small Input" />
    <TextInput label="Password" type="password" />
    <TextInput label="Number Input" type="number" value={'5'} />
    <TextInput label="Disabled" disabled value="Disabled input" />
    <TextInput label="Readonly" value="Readonly input" readOnly /> */}
  // </Card>
);