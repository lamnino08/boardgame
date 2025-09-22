'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { CreateTransactionCategoryInput } from "@/constant/form/transaction/category/create-edit-transaction-category-form-config";
import { EAPIMethod, RequestHelper } from "@/lib/api/api-helper";
import { ETransactionType, TransactionCategory } from "@/model/finance/transaction";


export const createTransactionCategory = async (data: CreateTransactionCategoryInput, type: ETransactionType) => {
    const response = await RequestHelper<TransactionCategory>({
        method: EAPIMethod.POST,
        url: API_ENDPOINTS.financial.categories.create(),
        data: {
            ...data,
            type
        }
    })

    return response;
}

export const getAllCategory = async (params?: { 
    search?: string; 
    limit?: number; 
    offset?: number;
    type?: ETransactionType}) => {
        return await RequestHelper<TransactionCategory[]>({
            method: EAPIMethod.GET,
            url: API_ENDPOINTS.financial.categories.getAll(params)
        }
    );
}

export const updateCategory = async (id: string, data: CreateTransactionCategoryInput) => {
    return RequestHelper<TransactionCategory>({
        method: EAPIMethod.PUT,
        url: API_ENDPOINTS.financial.categories.update(id),
        data
    })
}

export const deleteCategory = async (id: string) => {
    return await RequestHelper({
        method: EAPIMethod.DELETE,
        url: API_ENDPOINTS.financial.categories.remove(id)
    })
}
