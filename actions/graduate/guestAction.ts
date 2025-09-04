'use server'

import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { ApiResponse, EAPIMethod, RequestHelper } from "@/lib/api/api-helper";
import { GuestAuthCheck } from "@/model/graduate/graduate";
import { cookies } from "next/headers";

export async function confirmName(data: { name: string }): Promise<ApiResponse<{ token: string }>> {
  const response = await RequestHelper<{ token: string; }>({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.graduate.guest.confirmName(),
    data,
  }
  );

  if (response.meta.success && response.data?.token) {
    const cookieStore = await cookies();

    cookieStore.set("token", response.data.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const getGuestConfirmStatus = async (): Promise<ApiResponse<boolean>> => {
  return await RequestHelper<boolean>({
    method: EAPIMethod.GET,
    url: API_ENDPOINTS.graduate.guest.getConfirmStatus(),
  });
}

export const confirmAttend = async (): Promise<ApiResponse<void>> => {
  return await RequestHelper<void>({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.graduate.guest.confirm(),
  });
}

export const cancelConfirmAttend = async (): Promise<ApiResponse<void>> => {
  return await RequestHelper<void>({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.graduate.guest.cancle_confirm(),
  });
}

export const guestAuthCheck = async (): Promise<GuestAuthCheck> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  if (!token) {
    return {
      isAuthenticated: false,
    };
  }

  try {
    const response = await RequestHelper<GuestAuthCheck>({
      method: EAPIMethod.GET,
      url: API_ENDPOINTS.graduate.guest.authCheck(),
    }
    );
    return response.data ? response.data : { isAuthenticated: false };
  } catch (error) {
    console.error("[AuthCheck Error]:", error);
    return {
      isAuthenticated: false,
    };
  }
};
