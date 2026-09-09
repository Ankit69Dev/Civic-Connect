import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isAdminLogin = pathname === "/admin/login";

  // -----------------------------
  // DASHBOARD
  // -----------------------------
  if (isDashboard) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/login", req.nextUrl.origin)
      );
    }

    return NextResponse.next();
  }

  // -----------------------------
  // ADMIN LOGIN
  // -----------------------------
  if (isAdminLogin) {
    // If already logged in as admin, go directly to admin
    if (isLoggedIn && req.auth?.user?.role === "admin") {
      return NextResponse.redirect(
        new URL("/admin", req.nextUrl.origin)
      );
    }

    return NextResponse.next();
  }

  // -----------------------------
  // ADMIN
  // -----------------------------
  if (isAdmin) {
    // Not logged in → admin login
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL("/admin/login", req.nextUrl.origin)
      );
    }

    // IMPORTANT:
    // If logged in as a non-admin, send them to admin login
    // instead of dashboard.
    if (req.auth?.user?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/login", req.nextUrl.origin)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};