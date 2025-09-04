'use server'

import { RequestHelper, ApiResponse, EAPIMethod } from "@/lib/api/api-helper";
import { API_ENDPOINTS } from "@/constant/api/api-endpoint";
import { LoginInput } from "@/constant/form/user/login-form-config";
import { cookies } from "next/headers";
import { SignUpInput } from "@/constant/form/user/sign-up-form-config";
import { AuthCheck } from "@/lib/auth";

export async function login(data: LoginInput): Promise<ApiResponse<{ token: string }>> {
  const response = await RequestHelper<{ token: string; email: string; name: string }>({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.users.login(),
    data,
  });

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

export async function signUp(data: SignUpInput): Promise<ApiResponse<any>> {
  return RequestHelper({
    method: EAPIMethod.POST,
    url: API_ENDPOINTS.users.register(),
    data,
  });
}

export async function authCheck(): Promise<ApiResponse<AuthCheck>> {
  return RequestHelper<AuthCheck>({
    method: EAPIMethod.GET,
    url: API_ENDPOINTS.users.authCheck(),
  });
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
