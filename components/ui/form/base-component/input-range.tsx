import React, { useState } from 'react';
import {Card} from '../../Card';
import { BaseInput } from '@/components/FormBuilder/types';

interface RangeInputProps extends BaseInput<number> {
  min?: number;
  max?: number;
  step?: number;
  color?: 'blue' | 'red' | 'purple';
  showValue?: boolean;
}

export const RangeInput: React.FC<RangeInputProps> = ({
  label = '',
  min = 0,
  max = 100,
  step = 1,
  value = 50,
  color = 'blue',
  disabled = false,
  showValue = true,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    setInternalValue(newVal);
    onChange?.(newVal);
  };

  const colorHex = {
    blue: '#3b82f6',
    red: '#ef4444',
    purple: '#a855f7',
  }[color];

  const percent = ((internalValue - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        {label && <label className="form-label">{label}</label>}
        {showValue && <span className="text-text-primary text-sm">{internalValue}</span>}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={internalValue}
        disabled={disabled}
        onChange={handleChange}
        style={{
          background: disabled
            ? '#3f3f46'
            : `linear-gradient(to right, ${colorHex} ${percent}%, #3f3f46 ${percent}%)`,
        }}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer 
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:h-4
          [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow
          [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-background
          hover:[&::-webkit-slider-thumb]:scale-110
          disabled:cursor-not-allowed disabled:opacity-50
        `}
      />
    </div>
  );
};

export const RangeInputShowCase = () => {
  return (
    <Card>
      <div className="text-app-blue-light font-semibold mb-3 text-lg">Range Inputs</div>
      <RangeInput label="Example range" color="blue" />
      <RangeInput label="Disabled range" disabled />
      <RangeInput label="Example range" color="purple" value={70} />
    </Card>
  );
};
