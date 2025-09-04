import { EUploadType } from "@/constant/upload/allowUploadType";


const CLIENT_SIDE_PROXY_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_SIDE_PROXY_URL || '/api';

interface QueryParams {
    [key: string]: string | number | boolean | undefined;
}

const buildUrl = (path: string, queryParams?: QueryParams): string => {
    const url = `${CLIENT_SIDE_PROXY_BASE_URL}${path}`;
    if (!queryParams) {
        return url;
    }

    const queryString = Object.entries(queryParams)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');

    return queryString ? `${url}?${queryString}` : url;
};

export const API_ENDPOINTS = {
    graduate: {
        guest: {
            confirmName: () => buildUrl('/graduate/guest/confirm-name'),
            authCheck: () => buildUrl('/graduate/guest/auth-check'),
            getConfirmStatus: () => buildUrl('/graduate/guest/confirm-status'),
            confirm: () => buildUrl('/graduate/guest/confirm'),
            cancle_confirm: () => buildUrl('/graduate/guest/cancle-confirm')
        },
        message: {
            create: () => buildUrl('/graduate/message'),
            getListForGuest: (params?: { offset?: number; limit?: number }) => buildUrl('/graduate/message', params),
            delete: (id: string) => buildUrl(`/graduate/message/${id}`)
        },
        memory: {
            create: () => buildUrl('/graduate/memory'),
            getListForGuest: (params?: { offset?: number; limit?: number }) => buildUrl('/graduate/memory/all', params),
            delete: (id: string) => buildUrl(`/graduate/memory/${id}`),
        },
        answer: {
            submit: () => buildUrl('/graduate/answer'),
            getAnswersubmit: () => buildUrl('/graduate/answer'),
        }
    },
    users: {
        register: () => buildUrl('/users/register'),
        login: () => buildUrl('/users/login'),
        authCheck: () => buildUrl('/users/auth-check'),
        googleLogin: () => buildUrl('/users/google-login'),
        getAll: (params?: { search?: string; limit?: number; offset?: number }) => buildUrl('/users', params),
        update: (id: number) => buildUrl(`/users/${id}`),
    },
    financial: {
        categories: {
            create: () => buildUrl('/financial/categories'),
            getAll: (params?: { search?: string; limit?: number; offset?: number }) => buildUrl('/financial/categories', params),
            getById: (id: number) => buildUrl(`/financial/categories/${id}`),
            update: (id: number) => buildUrl(`/financial/categories/${id}`),
            remove: (id: number) => buildUrl(`/financial/categories/${id}`),
        },
        transactions: {
            create: () => buildUrl('/financial/transactions'),
            getAll: (params?: { search?: string; limit?: number; offset?: number }) => buildUrl('/financial/transactions', params),
            getById: (id: number) => buildUrl(`/financial/transactions/${id}`),
            update: (id: number) => buildUrl(`/financial/transactions/${id}`),
            remove: (id: number) => buildUrl(`/financial/transactions/${id}`),
            getByDateRange: (params: { startDate: string; endDate: string }) => buildUrl('/financial/transactions/date-range', params),
        },
        balance: () => buildUrl('/financial/balance'),
        summary: (params: { type: 'income' | 'expense' }) => buildUrl('/financial/summary', params),
    },
    upload: {
        uploadMultiple: (type: EUploadType) => buildUrl(`/upload/multiple/${type}`),
        delete: () => buildUrl(`/upload`)
    },
};
