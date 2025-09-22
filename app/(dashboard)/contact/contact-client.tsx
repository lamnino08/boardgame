'use client'

import { FormBuilder } from "@/components/FormBuilder/FormBuilder";
import { config, ContactFormInput } from "@/constant/form/contact/contact-form-config";
import { useState } from "react";

export default function ContactClient() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (values: ContactFormInput) => {
    setLoading(true);
    console.log("Form values:", values);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        {submitted ? (
          <div className="text-center p-6 rounded-lg border border-success">
            <h2 className="text-xl font-semibold">🎉 Thank you!</h2>
            <p className="mt-2">
              We’ve received your message and will get back to you shortly.
            </p>
          </div>
        ) : (
          <FormBuilder
            config={config}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
