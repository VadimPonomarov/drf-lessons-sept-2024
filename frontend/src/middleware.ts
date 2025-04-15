import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

export async function middleware(req: NextRequestWithAuth) {
  console.log("Middleware start for URL:", req.url);

  // Block direct access to API from the browser address bar
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
      console.log("Authentication failed. Redirecting to sign-in page...");
      // Redirect to sign-in page with a callback URL
      const callbackUrl = encodeURIComponent(req.url);
      return NextResponse.redirect(new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", (error as Error).message);
    return NextResponse.redirect(new URL("/error", req.url)); // Redirect to a generic error page
  }
}

export { middleware as default };

export const config = {
  matcher: [
    "/api/:path*",
    "/recipes/:path*",
    "/profile/:path*",
    "/users/:path*",
  ],
};
