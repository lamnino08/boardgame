'use client';

import { FormBuilder } from "@/components/FormBuilder/FormBuilder";
// import { createTransactionCategory } from "@/actions/transaction/category";
import { createTransactionCategoryConfig, CreateTransactionCategoryInput } from "@/constant/form/transaction/category/create-transaction-category-form-config";
import { useAlert } from "@/contexts/alert-context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const CreateTransactionCategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const showAlert = useAlert();
  const router = useRouter();

  const handleSubmit = async (values: CreateTransactionCategoryInput) => {
    setLoading(true);

    // const response = await createTransactionCategory(values);

    // if (response.meta.success) {
    //   showAlert("Category created successfully", "success");
    //   router.push("/categories"); // hoặc bất kỳ route nào bạn muốn chuyển hướng đến
    // } else {
    //   showAlert(response.meta.external_message, "error");
    // }

    setLoading(false);
  };

  return (
    <FormBuilder
      config={createTransactionCategoryConfig}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
};
