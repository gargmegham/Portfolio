import { NextResponse } from "next/server";

export function middleware(request) {
  // Check if the request is for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip authentication check for login page and auth API
    if (
      request.nextUrl.pathname === "/admin" ||
      request.nextUrl.pathname.startsWith("/api/admin/auth")
    ) {
      return NextResponse.next();
    }

    // Check for admin session cookie
    const adminSession = request.cookies.get("admin-session");
    
    if (!adminSession || adminSession.value !== "authenticated") {
      // Redirect to admin login page
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};