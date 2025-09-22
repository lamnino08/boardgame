import React, { useState, useEffect } from "react";
import { ColorPicker } from "@/components/ui/form/base-component/color-pick";
import { EAlertType, useAlert } from "@/contexts/alert-context";

interface EditableCellColorProps {
  value: string;
  rowId: string;
  apiUpdateFn: (rowId: string, value: string) => Promise<any>;
  renderDisplay?: (value: string) => React.ReactNode;
}

export function EditableCellColor({
  value,
  rowId,
  apiUpdateFn,
  renderDisplay,
}: EditableCellColorProps) {
  const [editing, setEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const [inputValue, setInputValue] = useState(value);
  const showAlert = useAlert();

  useEffect(() => {
    setDisplayValue(value);
    setInputValue(value);
  }, [value]);

  const handleSave = async (newColor: string) => {
    if (newColor !== displayValue) {
      const response = await apiUpdateFn(rowId, newColor);
      if (!response.meta?.success) {
        showAlert(response.meta.external_message, EAlertType.ERROR);
        setInputValue(displayValue); // Revert to old value on error
      } else {
        setDisplayValue(newColor);
        showAlert('Color updated successfully!', EAlertType.SUCCESS);
      }
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setInputValue(displayValue);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="relative z-10"> {/* Ensure color picker is on top */}
        <ColorPicker
          value={inputValue}
          onChange={(newColor) => {
            setInputValue(newColor);
            handleSave(newColor); // Save immediately when color changes
          }}
        />
      </div>
    );
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className="cursor-pointer w-full px-2 py-1 rounded transition-colors hover:bg-background flex items-center gap-2 min-h-[36px]"
      style={{ minHeight: 36 }}
    >
      {renderDisplay ? renderDisplay(displayValue) : (
        <>
          <div
            className="w-4 h-4 rounded-full border border-border"
            style={{ backgroundColor: displayValue }}
          />
          <span className="text-sm text-text-secondary font-mono">{displayValue.toUpperCase()}</span>
        </>
      )}
    </div>
  );
}
