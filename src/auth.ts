import Credentials from '@auth/core/providers/credentials';

import NextAuth, { type DefaultSession } from 'next-auth';
import { api } from '@/utils/api';

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
        let user = null;

        await api.auth
          .login(credentials)
          .json<ILoginResponse>()
          .then((res) => {
            user = { email: res.medicalCentre?.email, ...res };
          });

        console.log('SERVER user', user);

        if (!user) {
          throw new Error('Invalid credentials.');
        }

        return user;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.id = user.id;
      }

      console.log('JWT Callback - Token:', token);
      console.log('JWT Callback - User:', user);

      return token;
    },

    async session({ session, token }) {
      // session.accessToken = token.accessToken;

      console.log('callbacks session', session);
      console.log('callbacks token', token);
      return session;
    },
  },

  pages: {
    signIn: '/login',
  },
});
