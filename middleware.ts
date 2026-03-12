import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (req.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/settings',
    '/api/settings/:path*',
    '/api/events',
    '/api/events/:path*',
    '/api/departments',
    '/api/departments/:path*',
    '/api/sermons',
    '/api/sermons/:path*',
    '/api/posts',
    '/api/posts/:path*',
    '/api/albums',
    '/api/albums/:path*',
    '/api/photos/:path*',
    '/api/upload',
    '/api/upload/:path*',
  ],
};
