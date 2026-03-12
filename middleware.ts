import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/api/settings/:path*',
    '/api/events/:path*',
    '/api/departments/:path*',
    '/api/sermons/:path*',
    '/api/posts/:path*',
    '/api/albums/:path*',
    '/api/photos/:path*',
    '/api/upload/:path*',
  ],
};
