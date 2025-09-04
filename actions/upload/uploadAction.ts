'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { EUploadType } from "@/constant/upload/allowUploadType";
import { ApiResponse, RequestHelper, EAPIMethod } from "@/lib/api/api-helper";

/**
 * Upload multiple files
 */
export const uploadFiles = async (files: File[]): Promise<ApiResponse<string[]>> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await RequestHelper<string[]>({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.upload.uploadMultiple(EUploadType.GRADUATE_MEMORY),
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
