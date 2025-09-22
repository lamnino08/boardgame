import { ETransactionType } from '@/model/finance/transaction';
import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Category name cannot be empty').max(20, 'Name must not exceed 20 characters.'),
    type: z.nativeEnum(ETransactionType),
    color: z.string().min(1, 'color is required and must be a valid color code'),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Category name cannot be empty').max(20, 'Name must not exceed 20 characters.'),
    type: z.nativeEnum(ETransactionType).optional(),
    color: z.string().min(1, 'color is required and must be a valid color code'),
});

export const getCategoriesSchema = z.object({
    search: z.string().optional(),
    type: z.nativeEnum(ETransactionType, { required_error: "Type is required and must be 'income' or 'expense'" }),
    limit: z.string().optional().default('10').transform(Number).refine(val => val > 0, { message: "Limit must be a positive number" }),
    offset: z.string().optional().default('0').transform(Number).refine(val => val >= 0, { message: "Offset must be a non-negative number" }),
});

export const getSummarySchema = z.object({
    type: z.nativeEnum(ETransactionType),
});
