import { TextInput } from "@/components/ui/form/base-component/text-input";
import Dropdown from "@/components/ui/form/base-component/dropdown";
import React, { useState, useRef, useEffect } from "react";
import { EAlertType, useAlert } from "@/contexts/alert-context";

interface EditableCellTextProps<T = any> {
  value: T;
  rowId: string;
  apiUpdateFn: (rowId: string, value: T) => Promise<any>;
  renderDisplay?: (value: T) => React.ReactNode;
  inputType?: "text" | "number";
  inputProps?: React.ComponentProps<typeof TextInput>;
}

export function EditableCellText<T = any>({
  value,
  rowId,
  apiUpdateFn,
  renderDisplay,
  inputType = "text",
  inputProps,
}: EditableCellTextProps<T>) {
  const [editing, setEditing] = useState(false);
  const [displayValue, setDisplayValue] = useState<T>(value);
  const [inputValue, setInputValue] = useState<T>(value);
  const showAlert = useAlert();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setDisplayValue(value);
    setInputValue(value);
  }, [value]);

  const handleSave = async () => {
    let sendValue: any = inputValue;
    if (inputType === 'number') {
      sendValue = typeof inputValue === 'string' ? parseFloat(inputValue) : inputValue;
      if (isNaN(sendValue)) sendValue = displayValue;
    }
    if (sendValue !== displayValue) {
      const response = await apiUpdateFn(rowId, sendValue);
      if (!response.meta?.success) {
        showAlert(response.meta.external_message, EAlertType.ERROR);
        setInputValue(displayValue as any);
      } else {
        setDisplayValue(sendValue);
      }
    }
    setEditing(false);
  };

  if (editing) {
    return (
      <TextInput
        type={inputType}
        size="sm"
        value={inputValue as any}
        onChange={setInputValue as any}
        placeholder=""
        onSubmit={handleSave}
        onBlur={() => {
          handleSave
        }}
        inputRef={inputRef}
        {...inputProps}
      />
    );
  }

  return (
    <div
      onDoubleClick={() => setEditing(true)}
      className="cursor-pointer w-full px-2 py-1 rounded transition-colors hover:bg-background flex items-center min-h-[36px]"
      style={{ minHeight: 36 }}
    >
      {renderDisplay ? renderDisplay(displayValue) : (displayValue as any)}
    </div>
  );
}
