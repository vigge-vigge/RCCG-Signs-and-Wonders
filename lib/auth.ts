import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

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

        // Read admin credentials from environment variables
        // In production, store admin users in a database (recommended)
        const adminEmail = process.env.NEXTAUTH_ADMIN_EMAIL;
        const adminPasswordHash = process.env.NEXTAUTH_ADMIN_PASSWORD_HASH;

        if (!adminEmail || !adminPasswordHash) {
          console.warn('NEXTAUTH_ADMIN_EMAIL or NEXTAUTH_ADMIN_PASSWORD_HASH not set');
          return null;
        }

        if (credentials.email === adminEmail) {
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            adminPasswordHash
          );

          if (passwordMatch) {
            return {
              id: '1',
              email: adminEmail,
              name: 'Admin',
            };
          }
        }

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
