'use client'
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormConfig } from './types';
import Input from './Input';

interface FormBuilderProps {
  formConfig: FormConfig;
  onSubmit: (data: any) => void;
}

const FormBuilder: React.FC<FormBuilderProps> = ({ formConfig, onSubmit }) => {
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        {formConfig.map((field) => (
          <Input key={field.name} field={field} />
        ))}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
};

export default FormBuilder;
