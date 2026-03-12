import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const hasSession =
    req.cookies.has('__Secure-next-auth.session-token') ||
    req.cookies.has('next-auth.session-token');

  if (!hasSession) {
    const loginUrl = new URL('/admin/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};

