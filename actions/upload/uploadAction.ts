'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { EUploadType } from "@/constant/upload/allowUploadType";
import { ApiResponse, RequestHelper, EAPIMethod } from "@/lib/api/api-helper";

/**
 * Upload multiple files
 */
export const uploadFiles = async (formData: FormData, type: EUploadType, id?: string): Promise<ApiResponse<string[]>> => {
  if (id) {
    formData.append("id", id);
  }

  const response = await RequestHelper<string[]>({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.upload.uploadMultiple(type),
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};

export const deleteFile = async (filePath: string): Promise<ApiResponse<void>> => {
  const response = await RequestHelper<void>({
    method: EAPIMethod.DELETE,
    url: API_ENDPOINTS.upload.delete(),
    data: { filePath },
  });

  return response;
};
