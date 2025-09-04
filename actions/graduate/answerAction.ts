'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { ApiResponse, EAPIMethod, RequestHelper } from "@/lib/api/api-helper";

export const submitAnswer = async (question_id: number, answer: string): Promise<ApiResponse<any>> => {
    return await RequestHelper({
        method: EAPIMethod.POST,
        url: API_ENDPOINTS.graduate.answer.submit(),
        data: { question_id, answer },
    });
};
