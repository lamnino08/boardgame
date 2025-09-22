import React, { useState, useEffect, useRef } from "react";
import { EAlertType, useAlert } from "@/contexts/alert-context";
import { TextInput } from "@/components/ui/form/base-component/text-input";

interface EditableCellDateProps {
  value: Date | string | null | undefined;
  rowId: string;
  apiUpdateFn: (rowId: string, value: Date) => Promise<any>;
  renderDisplay?: (value: Date | null) => React.ReactNode;
  dateFormat?: string;
  className?: string;
}

export function EditableCellDate({
  value,
  rowId,
  apiUpdateFn,
  renderDisplay,
  dateFormat = "en-GB",
  className,
}: EditableCellDateProps) {
  const [editing, setEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const showAlert = useAlert();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    const dateValue = value ? new Date(value) : null;
    setDisplayValue(dateValue);
    setInputValue(dateValue ? dateValue.toISOString().split('T')[0] : "");
  }, [value]);

  const handleSave = async (newValue: string) => {
    const newDate = newValue ? new Date(newValue) : null;
    
    if (newDate && (!displayValue || newDate.getTime() !== displayValue.getTime())) {
      const response = await apiUpdateFn(rowId, newDate);
      if (!response.meta?.success) {
        showAlert(response.meta?.external_message, EAlertType.ERROR);
        setInputValue(displayValue ? displayValue.toISOString().split('T')[0] : "");
      } else {
        setDisplayValue(newDate);
      }
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <TextInput
        type="date"
        size="sm"
        value={inputValue}
        onChange={setInputValue}
        placeholder=""
        onSubmit={() => handleSave(inputValue)}
        onBlur={() => {
          // setEditing(false);
          // setInputValue(displayValue ? displayValue.toISOString().split('T')[0] : "");
          handleSave(inputValue)
        }}
        inputRef={inputRef}
        className={className}
      />
    );
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className={`cursor-pointer w-full px-2 py-1 rounded transition-colors hover:bg-background flex items-center min-h-[36px] ${className || ''}`}
      style={{ minHeight: 36 }}
    >
      {renderDisplay
        ? renderDisplay(displayValue)
        : displayValue
        ? displayValue.toLocaleDateString(dateFormat)
        : "No date"}
    </div>
  );
}
