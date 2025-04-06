import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';
import withAuth, { NextRequestWithAuth } from 'next-auth/middleware';

async function setHeaders(res: NextResponse) {
    res.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    return res;
}

export async function middleware(req: NextRequestWithAuth) {
    console.log('Middleware start for URL:', req.url);

    // Block direct access to /api from the browser address bar
    if (req.url.includes('/api/') && (!req.headers.get('referer') || req.headers.get('referer') === req.url)) {
        console.log('Direct access to API from the address bar is blocked. Redirecting to /error.');
        return NextResponse.redirect(new URL('/error', req.url));
    }

    try {
        const response = await withAuth(req, {});
        if (response) {
            return response;
        }

        const accessToken = await getCookie('accessToken', { req });

        // Redirect to /api/auth if access token is missing
        if (!accessToken && !req.url.includes('/api/auth')) {
            console.log('Redirecting to /api/auth due to missing access token.');
            return NextResponse.redirect(new URL('/api/auth', req.url));
        }

        // Set headers for the next middleware or handler
        const res = NextResponse.next();
        await setHeaders(res);
        return res;
    } catch (error) {
        console.error('Middleware error:', (error as Error).message);

        // Redirect to /api/auth in case of an error (e.g., 401 Unauthorized)
        if ((error as Error).message.includes('401') || (error as Error).message.includes('Unauthorized')) {
            console.log('Redirecting to /api/auth due to 401 Unauthorized error.');
            return NextResponse.redirect(new URL('/api/auth', req.url));
        }

        // Handle other errors
        return NextResponse.redirect(new URL('/error', req.url));
    }
}

export { middleware as default };

export const config = {
    matcher: [
        '/api/recipes/:path*',
        '/recipes/:path*',
        '/profile/:path*',
        '/users/:path*'
    ],
};
