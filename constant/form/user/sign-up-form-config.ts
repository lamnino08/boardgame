import { TextFieldFactory } from "@/components/FormBuilder/FormFactory";
import { FormConfig, ExtractFormValues } from "@/components/FormBuilder/types";
import icons from "@/components/icons";
import z from "zod";

const usernameField = new TextFieldFactory(
    {
        label: "User name",
        value: "",
        placeholder: "Enter your name",
        variant: 'floating',
    },
    z.string().min(3, "User name must be at least 3 characters")
);

const emailField = new TextFieldFactory(
    {
        label: "Email",
        value: "",
        placeholder: "Enter your email",
        type: "email",
        variant: 'floating',
    },
    z.string().email("Invalid email").nonempty("Email is required")
);

const passwordField = new TextFieldFactory(
    {
        label: "Password",
        value: "",
        placeholder: "Enter your password",
        type: "password",
        variant: 'floating',
    },
    z.string().min(6, "Password must be at least 6 characters")
);

const confirmPasswordField = new TextFieldFactory(
    {
        label: "Confirm Password",
        value: "",
        placeholder: "Confirm your password",
        type: "password",
        variant: 'floating',
    },
    z.string().min(6, "Password must be at least 6 characters")
);

export const signupFormConfig: FormConfig<{
    username: typeof usernameField;
    email: typeof emailField;
    password: typeof passwordField;
    confirmPassword: typeof confirmPasswordField;
}> = {
    title: {
        title: "Sign Up",
        variant: "center",
        icon: {
            icon: icons.logo
        }
    },
    fields: {
        username: usernameField,
        email: emailField,
        password: passwordField,
        confirmPassword: confirmPasswordField,
    },
    submitButtonText: "Sign Up",
};

export type SignUpInput = ExtractFormValues<typeof signupFormConfig["fields"]>