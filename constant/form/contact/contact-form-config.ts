import { TextFieldFactory, AreaTextFieldFactory } from "@/components/FormBuilder/FormFactory";
import { ExtractFormValues, FormConfig } from "@/components/FormBuilder/types";
import z from "zod";



const emailField = new TextFieldFactory(
  {
    label: "Email",
    value: "",
    placeholder: "example@gmail.com",
    type: "email",
  },
  z.string().email("Invalid email").nonempty("Email is required")
);

const subjectField = new TextFieldFactory(
  {
    label: "Subject",
    value: "",
    placeholder: "Let us know how we can help you",
    type: "text",
  },
  z.string().nonempty("Name is required")
);

const messageField = new AreaTextFieldFactory(
  {
    label: "Message",
    value: "",
    placeholder: "Enter your message",
    rows: 4,
  },
  z.string().nonempty("Message is required")
);

export const config: FormConfig<{
  email: typeof emailField;
  subject: typeof subjectField;
  message: typeof messageField;
}> = {
  title: {
    title: "Contact Us",
    variant: "center",
  },
  fields: {
    email: emailField,
    subject: subjectField,
    message: messageField,
  },
  submitButtonText: "Send Message",
};

export type ContactFormInput = ExtractFormValues<typeof config>;
