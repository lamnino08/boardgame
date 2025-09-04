import axios, { AxiosRequestConfig } from "axios";
import { cookies, headers } from "next/headers";
import { z } from "zod";
import Log from "../log";

export interface ApiResponse<T> {
  meta: {
    success: boolean;
    internal_message: string;
    external_message: string;
  };
  data?: T;
}

export enum EAPIMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

/**
 * Server-side API helper (Next.js Route Handler hoặc server component)
 */
export async function RequestHelper<T>(params: {
  method: EAPIMethod,
  url: string,
  data?: any,
  headers?: Record<string, string>,
}
): Promise<ApiResponse<T>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const lang = cookieStore.get("lang")?.value || "en";

    const fullUrl = `${process.env.NEXT_SERVER_API || process.env.NEXT_PUBLIC_API_URL}${params.url}`;

    const config: AxiosRequestConfig = {
      method: params.method,
      url: fullUrl,
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Accept-Language": lang,
        ...headers,
      },
      data: params.data,
      timeout: 5000,
    };
    Log.info('api-helper', 'RequestHelper', `URL: ${params.url}; data: ${JSON.stringify(params.data)}`);
    const response = await axios<ApiResponse<T>>(config);

    Log.info('api-helper', 'RequestHelper', `URL: ${params.url}; response: ${JSON.stringify(response.data.data)} `)
    return response.data;
  } catch (error: any) {
    let external_message = "An unexpected error occurred";
    let internal_message = error.message || "Unknown error";

    if (error.response) {
      const status = error.response.status;
      external_message =
        error.response.data?.meta?.external_message ||
        error.response.data?.message ||
        (status >= 400 && status < 500 ? "Client error" : "Server error");
      internal_message =
        error.response.data?.meta?.internal_message || error.message;
    }

    Log.error('api-helper', 'RequestHelper', `URL: ${params.url} - internal: ${internal_message} - external: ${external_message} `);
    return {
      meta: {
        success: false,
        internal_message,
        external_message,
      },
    };
  }
}
