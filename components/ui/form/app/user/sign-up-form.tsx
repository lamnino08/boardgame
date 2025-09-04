'use client'

import { FormBuilder } from "@/components/FormBuilder/FormBuilder";
import { useAlert } from "@/contexts/alert-context";
import { signupFormConfig, SignUpInput } from "@/constant/form/user/sign-up-form-config";
import { useState } from "react";
import { signUp } from "@/actions/user";
import { useRouter } from "next/navigation";

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const ShowAlert = useAlert();

  const handleSubmit = async (values: SignUpInput) => {
    setLoading(true);

    if (values.password !== values.confirmPassword) {
      ShowAlert("Passwords do not match", 'error');
      setLoading(false);
      return;
    }

    const response = await signUp(values);
    if (response.meta.success) {
      router.push("/sign-in");
    } else {
      console.log(response.meta.external_message);
      ShowAlert(response.meta.external_message, 'error');
    }

    setLoading(false);
  };

  return <FormBuilder config={signupFormConfig} onSubmit={handleSubmit} loading={loading} />;
};
