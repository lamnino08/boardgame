import { ColorSelectFieldFactory, DropdownFieldFactory, TextFieldFactory } from "@/components/FormBuilder/FormFactory";
import { ExtractFormValues, FormConfig } from "@/components/FormBuilder/types";
import { TransactionType } from "@/model/finance/transaction";
import z from "zod";

const nameField = new TextFieldFactory(
    {
        label: "Category Name",
        value: "",
        placeholder: "e.g. Coffee, Salary, Rent",
    },
    z.string().min(1, "Category name cannot be empty")
);

const typeField = new DropdownFieldFactory(
    {
        label: "Type",
        value: "expense",
        options: Object.values(TransactionType).map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1), // Hoặc dùng map riêng nếu cần i18n
            value,
        }))
    },
    z.nativeEnum(TransactionType)
);

const colorField = new ColorSelectFieldFactory(
    {
        label: "Color",
        value: "#22c55e", // default green
    },
    z.string().min(1, "Color is required")
);

export const createTransactionCategoryConfig: FormConfig<{
    name: typeof nameField;
    type: typeof typeField;
    color: typeof colorField;
}> = {
    title: {
        title: "New Category",
        variant: "left"
    },
    fields: {
        name: nameField,
        type: typeField,
        color: colorField,
    },
    submitButtonText: "Create Category",
};

export type CreateTransactionCategoryInput = ExtractFormValues<
    typeof createTransactionCategoryConfig["fields"]
>;
