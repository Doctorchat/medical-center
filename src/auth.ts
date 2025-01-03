import Credentials from '@auth/core/providers/credentials';

import NextAuth, { type DefaultSession, type User } from 'next-auth';
import { api } from '@/utils/api';
import type { ILogin, ILoginResponse } from '@/types';

declare module 'next-auth' {
  interface JWT {
    accessToken?: string;
    id?: string;
  }

  interface Session {
    user: {} & DefaultSession['user'] & ILoginResponse;
  }

  interface User {
    id?: string;
    token?: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log('Credentials received:', credentials);

        try {
          const res = await api.auth
            .login(credentials as ILogin)
            .json<ILoginResponse>();
          console.log('Login response:', res);

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
        token.id = user.id;
      }

      // console.log('JWT Callback - Token:', token);
      // console.log('JWT Callback - User:', user);

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken;

      // console.log('callbacks session', session);
      // console.log('callbacks token', token);
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
