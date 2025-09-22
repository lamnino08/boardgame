import { ETransactionType } from "@/model/finance/transaction";
import { dateValidator } from "@/utils/validation";
import { z } from "zod";

export const updateAmountTransactionSchema = z.object({
    amount: z.number().positive('Amount must be a positive number'),
});

export const updateTypeTransactionSchema = z.object({
    type: z.nativeEnum(ETransactionType),
});

export const updateNoteTransactionSchema = z.object({
    note: z.string().max(100, "Note must be at most 100 characters").optional(),
});


export const updateDateTransactionSchema = z.object({
    transaction_date: dateValidator
});

export const updateCategoryTransactionSchema = z.object({
    category_id: z.string().uuid("Invalid category ID").nullable().optional(),
});
