import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { decode } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import { prisma } from '../lib/prisma';

/**
 * Reads and decodes the NextAuth JWT directly from the cookie store.
 * This is the reliable way to check auth in Next.js 14 App Router route handlers.
 */
export async function getAuthToken() {
  const cookieStore = cookies();
  const token =
    cookieStore.get('__Secure-next-auth.session-token')?.value ??
    cookieStore.get('next-auth.session-token')?.value;
  if (!token) return null;
  return decode({ token, secret: process.env.NEXTAUTH_SECRET! });
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Try to authenticate against the Admin table in the database
        try {
          const adminEmail = credentials.email;
          const admin = await prisma.admin.findUnique({ where: { email: adminEmail } });

          if (admin) {
            const passwordMatch = await bcrypt.compare(credentials.password, admin.password);
            if (passwordMatch) {
              return {
                id: admin.id,
                email: admin.email,
                name: admin.name || 'Admin',
              };
            }
            return null;
          }
        } catch (e) {
          // If DB is not available, fall back to env-based admin credentials
          const errMsg = e instanceof Error ? e.message : String(e);
          console.warn('Prisma error in auth authorize(), falling back to env check:', errMsg);
        }

        // Fallback: read admin credentials from environment variables
        const envAdminEmail = process.env.NEXTAUTH_ADMIN_EMAIL;
        const envAdminPasswordHash = process.env.NEXTAUTH_ADMIN_PASSWORD_HASH;
        if (!envAdminEmail || !envAdminPasswordHash) return null;
        if (credentials.email === envAdminEmail) {
          const passwordMatch = await bcrypt.compare(credentials.password, envAdminPasswordHash);
          if (passwordMatch) {
            return {
              id: '1',
              email: envAdminEmail,
              name: 'Admin',
            };
          }
        }
        return null;

        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
