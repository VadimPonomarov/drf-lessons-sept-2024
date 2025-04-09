import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export async function middleware(req: NextRequestWithAuth) {
  console.log("Middleware start for URL:", req.url);

  // Block direct access to /api from the browser address bar
  if (
    req.url.includes("/api/") &&
    (!req.headers.get("referer") || req.headers.get("referer") === req.url)
  ) {
    console.log(
      "Direct access to API from the address bar is blocked. Redirecting to /error.",
    );
    return NextResponse.redirect(new URL("/error", req.url));
  }

  try {
    const response = await withAuth(req, {});
    if (response) {
      console.log("Authentication failed. Redirecting...");
      return NextResponse.redirect(new URL("/api/auth", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", (error as Error).message);
    // Redirect to /api/auth in case of an error (e.g., 401 Unauthorized)
    if ((error as Error).message.includes("401")) {
      console.log("Redirecting to /api/auth due to 401 Unauthorized error.");
      return NextResponse.redirect(new URL("/api/auth", req.url));
    }
    // Handle other errors
    return NextResponse.redirect(new URL("/error", req.url));
  }
}

export { middleware as default };

export const config = {
  matcher: [
    "/api/:path",
    "/recipes/:path*",
    "/profile/:path*",
    "/users/:path*",
  ],
};
