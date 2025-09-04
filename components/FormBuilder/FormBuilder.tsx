'use client'

import React, { useState } from "react";
import { FormConfig, ExtractFormValues } from "@/components/FormBuilder/types";
import Button from "@/components/ui/common/button/button";

interface FormBuilderProps<TFields extends Record<string, any>> {
  config: FormConfig<TFields>;
  onSubmit?: (values: ExtractFormValues<TFields>) => void;
  children?: React.ReactNode;
  loading?: boolean;
}

export function FormBuilder<TFields extends Record<string, any>>({
  config,
  onSubmit,
  children,
  loading,
}: FormBuilderProps<TFields>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = Object.entries(config.fields).map(([key, field]) => {
    (field as any).props.name = key;
    return { key, field };
  });

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    const values = {} as ExtractFormValues<TFields>;

    fields.forEach(({ key, field }) => {
      const errMessages = field.validate();
      if (errMessages.length > 0) {
        newErrors[key] = errMessages[0];
      }
      (values as any)[key] =
        typeof field.getValue === "function" ? field.getValue() : field.props.value;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit?.(values);
    }
  };

  const renderTitle = () => {
    if (!config.title) return null;

    const { title, shortcut, icon, variant } = config.title;
    const centerClass = `text-${variant}`;

    return (
      <div className="flex flex-col items-center gap-4">
        {icon && icon.variant === "logo" && (
          <div className="text-5xl text-green-500">{icon.icon}</div>
        )}
        <h1 className={`font-extrabold text-text-primary ${centerClass}`}>
          {icon && icon.variant === 'default' && icon.icon} {title}
        </h1>
        {shortcut && (
          <h3 className={`font-semibold text-text-secondary ${centerClass}`}>
            {shortcut}
          </h3>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-8 w-full h-full">
      {renderTitle()}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex flex-col gap-4 mt-6"
      >
        <div className="flex flex-col gap-8">
          {fields.map(({ key, field }) => (
            <div key={key}>{field.render(errors[key])}</div>
          ))}
        </div>

        {children}

        <Button type="submit" loading={loading}>{config.submitButtonText || "Submit"}</Button>
      </form>
    </div>
  );
}
