import { FieldFactory } from '@/components/FormBuilder/FormFactory';

export type FormFieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'dropdown'
    | 'date'
    | 'color'
    | 'range'
    | 'checkbox'
    | 'radio'
    | 'switch'
    | 'file';

// -------------------------
// Base input props
// -------------------------
export interface BaseInput<T = any> {
  name?: string;
  label?: string;
  value?: T;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: (value: T) => void;
  className?: string;
}

// -------------------------
// FormField generic
// -------------------------
export interface FormField<TProps> {
  component: string;
  props: TProps;
}

// -------------------------
// FormField generic
// -------------------------
export type ExtractFieldValue<T> = T extends FieldFactory<infer P>
  ? P["value"]
  : never;

export type ExtractFormValues<TFields> = {
  [K in keyof TFields]: ExtractFieldValue<TFields[K]>;
};

export interface FormConfig<TFields extends Record<string, FieldFactory<any>>> {
  title?: {
    title: string;
    shortcut?: string;
    icon?: {
      icon: React.ReactNode;
      variant?: "default" | "logo";
    };
    variant?: "left" | "center" | "right";
    className?: string;
  };
  fields: TFields;
  submitButtonText?: string;
}


export interface FormErrors {
  [key: string]: string | undefined;
}

