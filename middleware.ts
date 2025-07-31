import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/register");

  if (!token) {
    if (pathname.startsWith("/user") || pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", req.url);
      const redirectResponse = NextResponse.redirect(loginUrl);

      redirectResponse.cookies.set(
        "flash_error",
        "Anda harus login untuk mengakses halaman terkait !",
        {
          path: "/",
          maxAge: 30, 
        }
      );

      return redirectResponse;
    }

    return NextResponse.next();
  }

  if (token) {
    const role = token.role as "USER" | "ADMIN";

    if (isPublicPage) {
      const dashboardUrl =
        role === "USER" ? "/user/dashboard" : "/admin/dashboard";

      const redirectResponse = NextResponse.redirect(
        new URL(dashboardUrl, req.url)
      );

      redirectResponse.cookies.set(
        "flash_error",
        "Anda sudah login, Silahkan Logout untuk akses halaman terkait !",
        {
          path: "/",
          maxAge: 30,
        }
      );

      return redirectResponse;
    }

    if (role === "USER" && pathname.startsWith("/admin")) {
      const redirectResponse = NextResponse.redirect(
        new URL("/user/dashboard", req.url)
      );

      redirectResponse.cookies.set(
        "flash_error",
        "Anda tidak memiliki akses ke halaman admin !",
        {
          path: "/",
          maxAge: 30,
        }
      );

      return redirectResponse;
    }

    if (role === "ADMIN" && pathname.startsWith("/user")) {
      const redirectResponse = NextResponse.redirect(
        new URL("/admin/dashboard", req.url)
      );

      redirectResponse.cookies.set(
        "flash_error",
        "Anda tidak memiliki akses ke halaman user terkait!",
        {
          path: "/",
          maxAge: 30,
        }
      );

      return redirectResponse;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/verify",
    "/user/:path*",
    "/admin/:path*",
  ],
};