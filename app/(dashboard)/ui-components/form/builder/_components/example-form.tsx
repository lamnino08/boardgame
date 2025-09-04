'use client';
import React from 'react';
import { FormBuilder } from '@/components/FormBuilder/FormBuilder';
import { FormConfig } from '@/components/FormBuilder/types';
import { z } from 'zod';
const exampleFormConfig: FormConfig = {
    title: {
        text: 'Order Form Example',
        icon: <span className="text-2xl">🛒</span>,
        variant: 'center',
        // className: 'mb-6 text-text-primary font-bold text-3xl',                                                                                                                                         
    },
    fields: [
        {
            name: 'fullName',
            label: 'Full Name',
            type: 'text',
            placeholder: 'John Doe',
            defaultValue: '',
            validation: z.string().min(5, 'Full name must be at least 5 characters'),
        },
        {
            name: 'contactEmail',
            label: 'Contact Email',
            type: 'email',
            placeholder: 'john.doe@example.com',
            defaultValue: '',
            validation: z.string().email('Please enter a valid email address'),
        },
        {
            name: 'newPassword',
            label: 'New Password',
            type: 'password',
            placeholder: '********',
            defaultValue: '',
            validation: z.string().min(8, 'Password must be at least 8 characters'),
            props: { showTogglePassword: true },
        },
        {
            name: 'quantity',
            label: 'Quantity',
            type: 'number',
            placeholder: 'Enter quantity',
            defaultValue: 1,
            validation: z.number().min(1, 'Quantity must be at least 1').max(100, 'Quantity cannot exceed 100'),
            props: { showNumberControls: true },
        },
        {
            name: 'address',
            label: 'Shipping Address',
            type: 'textarea',
            placeholder: 'Street, City, State, Zip',
            defaultValue: '',
            validation: z.string().min(10, 'Address must be at least 10 characters').max(250, 'Address too long').optional(),
            props: { rows: 4 },
        },
        {
            name: 'productCategory',
            label: 'Product Category',
            type: 'dropdown',
            placeholder: 'Select a category',
            defaultValue: '',
            options: [
                { label: 'Electronics', value: 'electronics' },
                { label: 'Books', value: 'books' },
                { label: 'Clothing', value: 'clothing' },
                { label: 'Home Goods', value: 'home_goods' },
            ],
            validation: z.enum(['electronics', 'books', 'clothing', 'home_goods'], { required_error: "Please select a category" }),
        },
        {
            name: 'deliveryDate',
            label: 'Preferred Delivery Date',
            type: 'date',
            defaultValue: '',
            validation: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
            props: { minDate: new Date().toISOString().split('T')[0] }, // Example: min date is today                                                                  
        },
        {
            name: 'themeColor',
            label: 'Choose Theme Color',
            type: 'color',
        },
        {
            name: 'rating',
            label: 'Service Rating',
            type: 'range',
            min: 1,
            max: 5,
            step: 1,
            defaultValue: 3,
            validation: z.number().min(1).max(5),
            props: { color: 'blue' },
        },
        {
            name: 'termsAccepted',
            label: 'I accept the terms and conditions',
            type: 'checkbox',
            defaultValue: false,
            validation: z.boolean().refine(val => val === true, { message: "You must accept the terms" }),
        },
        {
            name: 'paymentMethod',
            label: 'Payment Method',
            type: 'radio',
            defaultValue: 'credit_card',
            options: [
                { label: 'Credit Card', value: 'credit_card' },
                { label: 'PayPal', value: 'paypal' },
                { label: 'Bank Transfer', value: 'bank_transfer' },
            ],
            validation: z.string().optional(),
        },
        {
            name: 'receivePromotions',
            label: 'Receive Promotional Emails',
            type: 'switch',
            defaultValue: true,
        },
        {
            name: 'invoiceFile',
            label: 'Upload Invoice (PDF only)',
            type: 'file',
            multiple: false,
            accept: '.pdf',
            maxSizeMB: 5,
            validation: z.any().optional(), // File validation can be complex, often handled separately                                                                
        },
    ],
    submitButtonText: 'Submit Order',
};
const ExampleForm: React.FC = () => {
    const handleSubmit = (data: Record<string, any>) => {
        console.log('Form submitted with data:', data);
        alert('Form submitted! Check console for data.');
    };
    return (
        <div className="p-4">
            <FormBuilder config={exampleFormConfig} onSubmit={handleSubmit} />
        </div>
    );
};

export default ExampleForm; 