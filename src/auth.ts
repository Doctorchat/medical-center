import Credentials from '@auth/core/providers/credentials';
import NextAuth, { type User } from 'next-auth';

import { authService } from '@/services/auth.service';
import type { ILogin, ILoginResponse, IMedicalCentre } from '@/types';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const res = await authService
            .login(credentials as ILogin)
            .json<ILoginResponse>();

          if (!res || !res.token) {
            console.error('Invalid credentials');
            throw new Error('Invalid credentials');
          }

          return { email: res.medicalCentre?.email, ...res } as User;
        } catch (err) {
          console.error('Authorization error:', err);
          throw new Error('Authorization failed');
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.medicalCentre = user.medicalCentre;
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user.medicalCentre = token.medicalCentre as IMedicalCentre;
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
  trustHost: true,
});
