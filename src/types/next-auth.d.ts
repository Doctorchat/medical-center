import type { DefaultSession } from 'next-auth';
import type { ILoginResponse } from '@/types/index';

declare module 'next-auth' {
  interface JWT {
    accessToken?: string;
    id?: string;
  }

  interface Session {
    user: {} & DefaultSession['user'] & ILoginResponse;
    accessToken?: string;
  }

  interface User extends ILoginResponse {
    id?: string;
    token?: string;
  }
}
