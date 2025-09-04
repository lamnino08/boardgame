import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from './types';

interface InputProps {
  field: FormField;
}

const Input: React.FC<InputProps> = ({ field }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
        {field.label}
      </label>
      {
        field.type === 'textarea' ? (
          <textarea
            id={field.name}
            {...register(field.name, field.validation)}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        ) : field.type === 'select' ? (
          <select
            id={field.name}
            {...register(field.name, field.validation)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            id={field.name}
            {...register(field.name, field.validation)}
            placeholder={field.placeholder}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        )
      }
      {errors[field.name] && (
        <p className="mt-2 text-sm text-red-600">{errors[field.name]?.message as string}</p>
      )}
    </div>
  );
};

export default Input;
