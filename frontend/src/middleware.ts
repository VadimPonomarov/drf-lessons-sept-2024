import { NextResponse } from "next/server";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";

// Список защищенных путей (требующих авторизации)
const PROTECTED_PATHS = [
  '/recipes',
  '/profile',
  '/users'
];

// Список разрешенных API маршрутов
const ALLOWED_API_PATHS = [
  '/api/auth/signin',
  '/api/auth/signout',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/redis'
];

export async function middleware(req: NextRequestWithAuth) {
  console.log("Middleware start for URL:", req.url);

  const url = new URL(req.url);
  
  // Проверяем, является ли текущий путь разрешенным API маршрутом
  const isAllowedApiPath = ALLOWED_API_PATHS.some(path => url.pathname.startsWith(path));

  // Block direct access to API from the browser address bar
  if (
    url.pathname.startsWith("/api/") &&
    (!req.headers.get("referer") || req.headers.get("referer") === req.url) &&
    !isAllowedApiPath
  ) {
    console.log("Direct API access blocked. Redirecting to /error");
    return NextResponse.redirect(new URL("/error", req.url));
  }

  try {
    const response = await withAuth(req, {});
    if (response) {
      console.log("Authentication failed. Redirecting to sign-in page...");
      
      const currentPath = url.pathname;
      const callbackUrl = PROTECTED_PATHS.includes(currentPath) ? currentPath : '/';
      
      const signInUrl = new URL("/api/auth/signin", req.url);
      signInUrl.searchParams.set("callbackUrl", callbackUrl);
      
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", (error as Error).message);
    return NextResponse.redirect(new URL("/error", req.url));
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