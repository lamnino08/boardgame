import { ZodSchema } from "zod";
import Dropdown, { DropdownProps } from "@/components/ui/form/base-component/dropdown";
import { TextInput, TextInputProps } from "@/components/ui/form/base-component/text-input";
import { ColorPicker, ColorPickerProps } from "@/components/ui/form/base-component/color-pick"
import { BaseInput } from "@/components/FormBuilder/types";

export abstract class FieldFactory<TProps extends BaseInput> {
  protected schema?: ZodSchema<TProps["value"]>;
  protected props: TProps;
  protected value: TProps["value"];

  constructor(props: TProps, schema?: ZodSchema<TProps["value"]>) {
    this.value = props.value;
    this.schema = schema;

    // Gắn onChange mặc định để cập nhật value
    this.props = {
      ...props,
      onChange: (val: any) => this.handleChange(val),
    } as TProps;
  }

  protected handleChange = (val: TProps["value"]) => {
    this.value = val;
  };

  getValue() {
    return this.value;
  }

  /** Validate theo schema */
  validate(): string[] {
    if (!this.schema) return [];
    const result = this.schema.safeParse(this.value);
    if (!result.success) {
      return result.error.errors.map((err) => err.message);
    }
    return [];
  }

  abstract render(error?: string): React.ReactNode;

  /** Render lỗi */
  protected renderError(error?: string): React.ReactNode {
    return error ? (
      <span className="text-danger text-sm">{error}</span>
    ) : null;
  }

  /** Render field (input hoặc dropdown) kèm lỗi */
  protected renderField(
    Component: React.ComponentType<TProps>,
    error?: string
  ) {
    return (
      <div className="flex flex-col gap-1">
        <Component {...this.props} />
        {this.renderError(error)}
      </div>
    );
  }
}

export class TextFieldFactory extends FieldFactory<TextInputProps> {
  render(error?: string): React.ReactNode {
    return this.renderField(TextInput, error);
  }
}

export class DropdownFieldFactory extends FieldFactory<DropdownProps> {
  render(error?: string): React.ReactNode {
    return this.renderField(Dropdown, error);
  }
}

export class ColorSelectFieldFactory extends FieldFactory<ColorPickerProps> {
  render(error?: string): React.ReactNode {
    return this.renderField(ColorPicker, error);
  }
}
