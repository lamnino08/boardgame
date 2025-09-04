'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { ApiResponse, RequestHelper, EAPIMethod } from "@/lib/api/api-helper";
import { Message } from "@/model/graduate/graduate";

export async function createMessage(data: { content: string }): Promise<ApiResponse<Message>> {
    const response = await RequestHelper<Message>({
        method: EAPIMethod.POST,
        url: API_ENDPOINTS.graduate.message.create(),
        data,
    });

    return response;
}

export async function getMessages(offset = 0, limit = 10): Promise<ApiResponse<Message[]>> {
    const response = await RequestHelper<Message[]>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.graduate.message.getListForGuest({ offset, limit }),
    });

    return response;
}

export async function deleteAmessage(id: string): Promise<ApiResponse<void>> {
    const response = await RequestHelper<void>({
        method: EAPIMethod.DELETE,
        url: API_ENDPOINTS.graduate.message.delete(id),
    });

    return response;
}
