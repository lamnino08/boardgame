'use client';

import { FormBuilder } from "@/components/FormBuilder/FormBuilder";
import { baseTransactionCategoryFormConfig, CreateTransactionCategoryInput, getColorField, getNameField } from "@/constant/form/transaction/category/create-edit-transaction-category-form-config";
import { useAlert } from "@/contexts/alert-context";
import { EAlertType } from "@/contexts/alert-context";
import { useState, useMemo } from "react";
import { ETransactionType, TransactionCategory } from "@/model/finance/transaction";
import { createTransactionCategory, updateCategory } from "@/actions/transaction/transactionCategoryAction";
// import { ColorSelectFieldFactory, TextFieldFactory } from "@/components/FormBuilder/FormFactory";

interface CreateTransactionCategoryFormProps {
  onSuccess?: (category: TransactionCategory) => void;
  initialData?: TransactionCategory; // For editing existing category
  typeDefault: ETransactionType; // Type passed from parent (e.g., Income or Expense)
}

export const CreateTransactionCategoryForm = ({ onSuccess, initialData, typeDefault }: CreateTransactionCategoryFormProps) => {
  const [loading, setLoading] = useState(false);
  const showAlert = useAlert();

  const isEditMode = useMemo(() => !!initialData, [initialData]);

  // Dynamically create form config based on initialData and mode
  const formConfig = useMemo(() => {
    const config = { ...baseTransactionCategoryFormConfig };

    config.fields = {
      name: getNameField(initialData?.name),
      color: getColorField(initialData?.color || (typeDefault === ETransactionType.INCOME ? "#22c55e" : "#ef4444")),
    };

    return {
      ...config,
    };
  }, [isEditMode, initialData, typeDefault]);

  const handleSubmit = async (values: CreateTransactionCategoryInput) => {
    setLoading(true);
    let response;

    if (isEditMode && initialData) {
      // Update existing category
      response = await updateCategory(initialData.id, values);
    } else {
      // Create new category
      response = await createTransactionCategory(values, typeDefault);
    }

    if (!response.meta.success) {
      showAlert(response.meta.external_message, EAlertType.ERROR);
      setLoading(false);
      return;
    }
    
    // showAlert(response.meta.external_message || `Category ${isEditMode ? 'updated' : 'created'} successfully!`, EAlertType.SUCCESS); // Moved this line up
    response.data && onSuccess?.(response.data);
    setLoading(false);
  };

  return (
    <FormBuilder
      config={formConfig}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};
