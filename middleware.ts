import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session cookie
  const sessionCookie = request.cookies.get("homeplate_session")?.value;
  let session: { id: string; role: string; email: string; sellerStatus?: string } | null = null;

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
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    const isAdmin =
      session.role === "admin" ||
      session.role === "super_admin" ||
      session.role === "operations_admin" ||
      session.role === "seller_support";

    if (!isAdmin) {
      const loginUrl = new URL("/", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Protected Seller Operational Routes
  const protectedSellerPaths = ["/seller/dashboard", "/seller/foods", "/seller/orders", "/seller/earnings"];
  if (protectedSellerPaths.some((p) => pathname.startsWith(p))) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "auth_required");
      return NextResponse.redirect(loginUrl);
    }

    // Role check: Customers and non-sellers cannot access seller operational routes
    if (session.role !== "seller") {
      const statusUrl = new URL("/seller/application-status", request.url);
      return NextResponse.redirect(statusUrl);
    }

    // Server-side enforcement: Only approved sellers can access seller operational dashboard
    if (session.sellerStatus && session.sellerStatus !== "approved") {
      const statusUrl = new URL("/seller/application-status", request.url);
      if (session.sellerStatus === "rejected") {
        statusUrl.searchParams.set("status", "rejected");
      } else if (session.sellerStatus === "suspended") {
        statusUrl.searchParams.set("status", "suspended");
      }
      return NextResponse.redirect(statusUrl);
    }
  }

  // 3. Guard Customer Private Routes (/orders, /profile)
  if (pathname.startsWith("/orders") || pathname.startsWith("/profile")) {
    if (!session) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("error", "auth_required");
      return NextResponse.redirect(loginUrl);
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
    "/orders/:path*",
    "/profile/:path*",
  ],
};
