import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { BaseInput } from "@/components/FormBuilder/types";

export interface ColorPickerProps extends BaseInput<string> {
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label = "Pick a color",
  disabled = false,
  onChange,
  className = "",
  value = "#000000",
  readOnly,
}) => {
  const [color, setColor] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange?.(newColor);
  };

  return (
    <div className={`flex items-center space-x-4 ${disabled || readOnly ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      {label && <span className="text-sm text-text-primary">{label}:</span>}
      <input
        type="color"
        value={color}
        disabled={disabled}
        onChange={handleChange}
        readOnly={readOnly}
        className="w-10 h-10 rounded-md cursor-pointer bg-card"
      />
      <span className="text-sm text-text-secondary">{color.toUpperCase()}</span>
    </div>
  );
};

export const ColorPickerShowcase = () => {
  const [selectedColor, setSelectedColor] = useState("#4f46e5");

  return (
    <Card>
      <div className="text-app-blue-light font-semibold text-lg mb-2">Color Picker</div>
      <ColorPicker label="Primary Color" value={selectedColor} onChange={setSelectedColor} />
      <ColorPicker label="Disabled Picker" value="#888888" disabled />
      <ColorPicker label="Disabled Picker" value="#888888" readOnly />
    </Card>
  );
};