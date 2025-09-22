import { ColorSelectFieldFactory, DropdownFieldFactory, TextFieldFactory } from "@/components/FormBuilder/FormFactory";
import { ExtractFormValues, FormConfig } from "@/components/FormBuilder/types";
import z from "zod";

export const getNameField = (initialValue: string = "") => new TextFieldFactory(
    {
        label: "Category Name",
        value: initialValue,
        placeholder: "e.g. Coffee, Salary, Rent",
    },
    z.string().min(1, 'Category name cannot be empty').max(20, 'Name must not exceed 20 characters.'),
);

export const getColorField = (initialValue: string = "#22c55e") => new ColorSelectFieldFactory(
    {
        label: "Color",
        value: initialValue,
    },
    z.string().min(1, "Color is required")
);

export const baseTransactionCategoryFormConfig: FormConfig<{
    name: TextFieldFactory;
    color: ColorSelectFieldFactory;
}> = {
    fields: {
        name: getNameField(),
        color: getColorField(),
    },
};

export type CreateTransactionCategoryInput = ExtractFormValues<
    typeof baseTransactionCategoryFormConfig
>;
