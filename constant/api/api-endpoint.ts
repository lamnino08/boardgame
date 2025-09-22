import { FilterParams } from "@/components/ui/view/datal-list-view";
import { EUploadType } from "@/constant/upload/allowUploadType";
import { ETransactionType, Transaction } from "@/model/finance/transaction";
import { SortParam } from "@/components/ui/view/datal-list-view";
import { Post } from "@/model/tst/post";


const CLIENT_SIDE_PROXY_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_SIDE_PROXY_URL || '/api';

interface QueryParams {
    [key: string]: object | string | number | boolean | undefined;
}

const buildUrl = (path: string, queryParams?: QueryParams): string => {
    const url = `${CLIENT_SIDE_PROXY_BASE_URL}${path}`;
    if (!queryParams) return url;

    console.log(queryParams);

    const queryString = Object.entries(queryParams)
        .filter(([, value]) => value !== undefined && value !== null)
        .flatMap(([key, value]) => {
            const params = [];

            // Case 1: Handle sort object (if applicable)
            if (key === 'sort' && typeof value === 'object' && value !== null) {
                const sortObject = value as { key: string; direction: string };
                params.push(
                    `sortKey=${encodeURIComponent(sortObject.key)}`,
                    `sortDirection=${encodeURIComponent(sortObject.direction)}`
                );
            }
            // Case 2: Handle range objects
            else if (key === "ranges" && typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([rangeKey, rangeValue]) => {
                    if (typeof rangeValue === 'object' && rangeValue !== null) {
                        const { from, to } = rangeValue as { from?: string; to?: string };
                        if (from) {
                            params.push(`${rangeKey}_from=${encodeURIComponent(from)}`);
                        }
                        if (to) {
                            params.push(`${rangeKey}_to=${encodeURIComponent(to)}`);
                        }
                    }
                });
            }
            // Case 3: Handle other nested objects (e.g., filters)
            else if (typeof value === "object" && value !== null && !(value instanceof Date)) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    let v = subValue instanceof Date ? subValue.toISOString() : subValue;
                    params.push(`${subKey}=${encodeURIComponent(String(v))}`);
                });
            }
            // Case 4: Handle primitive types
            else {
                let v = value instanceof Date ? value.toISOString() : value;
                params.push(`${key}=${encodeURIComponent(String(v))}`);
            }

            return params;
        })
        .join("&");

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
            create: () => buildUrl('/finance/category'),
            getAll: (params?: {
                search?: string;
                limit?: number;
                offset?: number;
                type?: ETransactionType
            }) => buildUrl('/finance/category', params),
            update: (id: string) => buildUrl(`/finance/category/${id}`),
            remove: (id: string) => buildUrl(`/finance/category/${id}`),
        },
        transactions: {
            create: () => buildUrl('/finance/transaction'),

            // read
            analys: {
                week_tranfer: (params: { date: Date, type: ETransactionType }) => buildUrl('/finance/transaction/week-transfer', params),
                month_tranfer: (params: { date: Date, type: ETransactionType }) => buildUrl('/finance/transaction/month-transfer', params),
            },

            getAll: (params?: FilterParams<Transaction>) => { return buildUrl('/finance/transaction', params); },
            getById: (id: string) => buildUrl(`/finance/transaction/${id}`),

            // update
            update_amount: (id: string) => buildUrl(`/finance/transaction/${id}/update/amount`),
            update_date: (id: string) => buildUrl(`/finance/transaction/${id}/update/date`),
            update_note: (id: string) => buildUrl(`/finance/transaction/${id}/update/note`),
            update_category: (id: string) => buildUrl(`/finance/transaction/${id}/update/category`),

            remove: (id: string) => buildUrl(`/finance/transaction/${id}`),
        },
        balance: () => buildUrl('/finance/balance'),
        summary: (params: { type: 'income' | 'expense' }) => buildUrl('/finance/summary', params),
    },
    upload: {
        uploadMultiple: (type: EUploadType) => buildUrl(`/upload/multiple/${type}`),
        delete: () => buildUrl(`/upload`)
    },
    TST: {
        post: {
            create: () => buildUrl('/tst/post'),

            get_post: (id: string) => buildUrl(`/tst/post/${id}`),
            getPosts: (params: FilterParams<Post>) => buildUrl('/tst/post', params),

            update_title: (id: string) => buildUrl(`/tst/post/${id}/update-title`),
            update_content: (id: string) => buildUrl(`/tst/post/${id}/update-content`),
            update_thumbnail: (id: string) => buildUrl(`/tst/post/${id}/update-avatar`),
            update_published: (id: string) => buildUrl(`/tst/post/${id}/update-published`),

            delete: (id: string) => buildUrl(`/tst/post/${id}`)
        }
    }
};
