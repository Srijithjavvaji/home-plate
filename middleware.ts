import { NextResponse, type NextRequest } from "next/server";


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session cookie
  const sessionCookie = request.cookies.get("homeplate_session")?.value;
  let session: { id: string; role: string; email: string } | null = null;

  if (sessionCookie) {
    try {
      session = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      session = null;
    }
  }

  // 1. Guard Admin Routes (/admin/* except /admin/login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    const isAdmin =
      session.role === "admin" ||
      session.role === "super_admin" ||
      session.role === "operations_admin" ||
      session.role === "seller_support";

    if (!isAdmin) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("error", "forbidden");
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Protected Seller Operational Routes
  // Allow unauthenticated/guest to access /seller/login, /seller/register, /seller/application-status, /seller/verification
  const protectedSellerPaths = ["/seller/dashboard", "/seller/foods", "/seller/orders", "/seller/earnings"];
  if (protectedSellerPaths.some((p) => pathname.startsWith(p))) {
    if (!session) {
      const loginUrl = new URL("/seller/login", request.url);
      loginUrl.searchParams.set("error", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== "seller") {
      const statusUrl = new URL("/seller/application-status", request.url);
      return NextResponse.redirect(statusUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/dashboard/:path*",
    "/seller/foods/:path*",
    "/seller/orders/:path*",
    "/seller/earnings/:path*",
  ],
};
