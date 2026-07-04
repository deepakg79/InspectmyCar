// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect only /admin routes
    if (path.startsWith('/admin')) {
        const adminToken = request.cookies.get('admin_session')?.value;

        // ✅ Use the correct env variable
        if (!adminToken || adminToken !== process.env.ADMIN_SESSION_ID) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
}