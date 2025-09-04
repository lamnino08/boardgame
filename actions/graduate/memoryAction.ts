'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { ApiResponse, EAPIMethod, RequestHelper } from "@/lib/api/api-helper";
import { Memory, Message } from "@/model/graduate/graduate";

export const createMemory = async (data: {
    caption: string;
    images: string[];
}) => {
    const response = await RequestHelper<Memory>({
        method: EAPIMethod.POST,
        url: API_ENDPOINTS.graduate.memory.create(),
        data,
    });

    return response;
}

export const getMemoryForGuest = async (offset = 0, limit = 10) =>{
    const response = await RequestHelper<Memory[]>({
        method: EAPIMethod.GET,
        url: API_ENDPOINTS.graduate.memory.getListForGuest({ offset, limit }),
    });

    return response;
}

export const deleteMemory = async (id: string) => {
    const response = await RequestHelper({
        method: EAPIMethod.DELETE,
        url: API_ENDPOINTS.graduate.memory.delete(id),
    });
    return response;
}
