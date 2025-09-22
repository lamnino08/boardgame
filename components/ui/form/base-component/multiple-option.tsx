import React, { useState } from 'react';
import { CheckIcon, MinusIcon, DotIcon } from '@/components/icons';
import {Card} from '../../Card';
import { BaseInput } from '@/components/FormBuilder/types';
import Toggle from './toggle'; // Import the new Toggle component

interface CheckboxProps extends BaseInput<boolean> {
  checked?: boolean;
  indeterminate?: boolean;
  color?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  color = 'blue',
  onChange,
  className,
}) => {
  const [internalChecked, setInternalChecked] = useState(checked);

  const handleChange = () => {
    if (disabled) return;
    const newVal = !internalChecked;
    setInternalChecked(newVal);
    onChange?.(newVal);
  };

  const colorClasses: Record<string, string> = {
    blue: 'border-app-blue-light',
    purple: 'border-app-purple-light',
    red: 'border-app-red-light',
  };

  return (
    <label
      className={`flex items-center space-x-3 cursor-pointer select-none transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className || ''}`}
    >
      <input
        type="checkbox"
        className={`hidden bg-background ${!disabled ? 'hover:scale-[1.10] transition-transform duration-200' : ''}`}
        checked={internalChecked}
        onChange={handleChange}
        disabled={disabled}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate && !internalChecked;
        }}
      />
      <span
        onClick={handleChange}
          className={`w-5 h-5 rounded-md border bg-background flex items-center justify-center transition-all duration-150 ${internalChecked || indeterminate ? `${colorClasses[color]}` : 'border-boder text-text-secondary'
          }`}
      >
        {indeterminate ? MinusIcon : internalChecked ? CheckIcon : null}
      </span>
      {label && <span className="text-text-primary text-sm">{label}</span>}
    </label>
  );
};


interface RadioProps extends BaseInput<string> {
  options: { label: string; value: string }[];
  color?: 'blue' | 'purple';
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  label,
  disabled = false,
  color = 'purple',
  options,
  onChange,
  className,
}) => {
  const colorClasses = {
    blue: 'border-app-blue-light',
    purple: 'border-app-purple-light',
  };

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      {label && <span className="text-text-primary text-sm mb-1">{label}</span>}
      {options.map((opt) => {
        const isSelected = value === opt.value;

        const handleSelect = () => {
          if (disabled) return;
          onChange?.(opt.value);
        };

        return (
          <label
            key={opt.value}
            className={`flex items-center space-x-3 cursor-pointer select-none transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={isSelected}
              onChange={() => onChange?.(opt.value)}
              disabled={disabled}
              className="hidden"
            />
            <span
              onClick={handleSelect}
              className={`w-5 h-5 rounded-full border bg-background flex items-center justify-center transition-all duration-150 ${isSelected ? colorClasses[color] : 'border-boder'
                }`}
            >
              {isSelected && (
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              )}
            </span>
            <span className="text-text-primary text-sm">{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
};

// ----- SHOWCASE -----
export const MultipleOptionShowCase = () => {
  const [radioValue, setRadioValue] = useState('1');

  return (
    <Card>
      <div>
        <div className="text-app-blue-light font-semibold mb-3 text-lg">Checkboxes</div>
        <Checkbox label="Default checkbox" />
        <Checkbox label="Checked checkbox" checked color="blue" />
        <Checkbox label="Indeterminate checkbox" indeterminate color="purple" />
        <Checkbox label="Disabled checkbox" disabled />
        <Checkbox label="Disabled checked checkbox" checked disabled />
      </div>

      <div>
        <div className="text-app-purple-light font-semibold mb-3 text-lg">Radios</div>

        {/* Radio mặc định */}
        <Radio
          label="Default radio"
          name="demo"
          value={radioValue}
          onChange={setRadioValue}
          options={[
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
            { label: 'Option 3', value: '3' },
            { label: 'Option 4', value: '4' },
            { label: 'Option 5', value: '5' },
          ]}
          color="blue"
        />
      </div>

      <div>
        <div className="text-app-red-light font-semibold mb-3 text-lg">Toggles</div>
        <Toggle label="Default toggle checkbox input" />
        <Toggle label="Checked toggle checkbox input" value={false} color="blue" />
        <Toggle label="Checked toggle checkbox input" value={true} color="red" />
        <Toggle label="Disabled toggle checkbox input" disabled />
        <Toggle label="Disabled checked toggle checkbox input" disabled />
      </div>
    </Card>
  );
};
