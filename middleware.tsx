import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPagePermission } from "@/constant/permission";

export async function middleware(request: Request) {
  const url = new URL(request.url);

  const permissionResponse = await checkPagePermission(url.pathname, request);
  if (permissionResponse) {
    return permissionResponse; 
  }

  const cookieStore = await cookies();

  const theme = cookieStore.get("theme")?.value || "light";
  const username = cookieStore.get("username")?.value || null;
  const email = cookieStore.get("email")?.value || null;
  const role = cookieStore.get("role")?.value || null;
  const id = cookieStore.get("id")?.value || null;

  const response = NextResponse.next();

  response.headers.set("x-theme", theme);

  if (username) {
    response.headers.set("x-username", username);
  }

  if (email) {
    response.headers.set("x-email", email);
  }

  if (role) {
    response.headers.set("x-role", role);
  }

  if (!cookieStore.get("theme")) {
    response.cookies.set("theme", "light", {
      path: "/",
      httpOnly: false,
    });
  }

  if (id) {
    response.headers.set("x-id", id);
  }

  return response;
}

export const config = {
  matcher: ['/', '/auth/:path*', '/finance/:path*', '/boardgame/:path*', '/admin/:path*', '/social/:path*', '/user/:path*', '/board-talk/:path*', '/graduate/:path*'],
}
