// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;

        // Public routes
        if (
          pathname === "/signin" ||
          pathname === "/signup" ||
          pathname.startsWith("/api") // pathname.startsWith("/api/auth")
        ) {
          return true;
        }

        // All other routes require auth
        return !!token;
      },
    },
  }
);

// ✅ Matcher includes everything except static assets
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
