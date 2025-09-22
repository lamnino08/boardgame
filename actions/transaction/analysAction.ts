'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { EAPIMethod, RequestHelper } from "@/lib/api/api-helper";
import { ETransactionType } from "@/model/finance/transaction";

export const getMonthTransfer = async (params: {
    type: ETransactionType
    date: Date
}) => {
    return RequestHelper<number>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.financial.transactions.analys.month_tranfer(params)
    })
};

export const getWeekTransfer = async (params: {
    type: ETransactionType
    date: Date
}) => {
    return RequestHelper<number>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.financial.transactions.analys.week_tranfer(params)
    })
};
