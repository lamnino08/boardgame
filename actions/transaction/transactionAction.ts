'use server'

import { FilterParams } from '@/components/ui/view/datal-list-view';
// Mock data Transaction
import { API_ENDPOINTS } from '@/constant/api/api-endpoint';
import { EAPIMethod, RequestHelper } from '@/lib/api/api-helper';
import { ESortDirection } from '@/model/common/sortDirection';
import { Transaction, ETransactionType, BaseFinanceData } from '@/model/finance/transaction';
import { updateAmountTransactionSchema, updateDateTransactionSchema, updateNoteTransactionSchema, updateTypeTransactionSchema, updateCategoryTransactionSchema } from '@/validations/transaction/transactionValidation';

export const creatTransaction = async () => {
    const response = await RequestHelper<Transaction>({
        method: EAPIMethod.POST,
        url: API_ENDPOINTS.financial.transactions.create()
    })

    return response;
}

export const getAllTransactions = async (params: FilterParams<Transaction>) => {
    return RequestHelper<Transaction[]>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.financial.transactions.getAll(params)
    })
};



export const updateAmount = async (transaction_id: string, amount: number) => {
    return RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.financial.transactions.update_amount(transaction_id),
        data: { amount },
        validationSchema: updateAmountTransactionSchema
    })
}

export const updateDate = async (transaction_id: string, date: Date) => {
    return RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.financial.transactions.update_date(transaction_id),
        data: { transaction_date: date },
        validationSchema: updateDateTransactionSchema
    })
}

export const updateNote = async (transaction_id: string, note: string) => {
    return RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.financial.transactions.update_note(transaction_id),
        data: { note },
        validationSchema: updateNoteTransactionSchema
    })
}

export const updateCategoryTransaction = async (transaction_id: string, category_id: string | null | undefined) => {
    return RequestHelper({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.financial.transactions.update_category(transaction_id),
        data: { category_id },
        validationSchema: updateCategoryTransactionSchema
    })
}

export const deleteTransaction = async (transaction_id: string) => {
    return RequestHelper<null>({
        method: EAPIMethod.DELETE,
        url: API_ENDPOINTS.financial.transactions.remove(transaction_id),
    })
}
