import { TextFieldFactory } from "@/components/FormBuilder/FormFactory";
import { ExtractFormValues, FormConfig } from "@/components/FormBuilder/types";
import icons from "@/components/icons";
import z from "zod";

const emailField = new TextFieldFactory(
  {
    label: "Email",
    value: "",
    placeholder: "Enter your email",
    variant: 'floating',
    type: "email",
  },
  z.string().email("Invalid email").nonempty("Email is required")
);

const passwordField = new TextFieldFactory(
  {
    label: "Password",
    value: "",
    placeholder: "Enter your password",
    variant: 'floating',
    type: "password",
  },
  z.string().min(6, "Password must be at least 6 characters")
);

export const config: FormConfig<{
  email: typeof emailField;
  password: typeof passwordField;
}> = {
  title: {
    title: "Sign In",
    variant: "center",
    icon: {
      icon: icons.logo
    }
  },
  fields: {
    email: emailField,
    password: passwordField,
  },
  submitButtonText: "Sign In",
};

export type LoginInput = ExtractFormValues<typeof config["fields"]>;