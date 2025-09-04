'use client'

import { FormBuilder } from "@/components/FormBuilder/FormBuilder";
import { login } from "@/actions/user";
import { useRouter } from "next/navigation";
import { config, LoginInput } from "@/constant/form/user/login-form-config";
import { useAlert } from "@/contexts/alert-context";
import { useState } from "react";

export const SignInForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const showAlert = useAlert();

  const handleSubmit = async (values: LoginInput) => {
    setLoading(true);

    const response = await login(values);
    if (response.meta.success) {
      router.push("/");
    } else {
      showAlert(response.meta.external_message, 'error');
    }
    setLoading(false);
  };

  return <FormBuilder config={config} onSubmit={handleSubmit} loading={loading} />;
};
