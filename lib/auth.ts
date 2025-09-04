import { authCheck } from "@/actions/user";
import { UserRole } from "@/model/user/user";
import { cookies } from "next/headers";

export interface UserAuthen {
    id: string,
    username: string,
    email: string,
    role: UserRole,
}

export interface AuthCheck {
  isAuthenticated: boolean;
  user?: UserAuthen
}

export const AuthCheck = async (): Promise<AuthCheck> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || null;

  if (!token) {
    return {
      isAuthenticated: false,
    };
  }

  try {
      const response = await authCheck();
      return response.data ? response.data : { isAuthenticated: false};
  } catch (error) {
    console.error("[AuthCheck Error]:", error);
    return {
      isAuthenticated: false,
    };
  }
};
