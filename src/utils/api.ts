import ky from 'ky';
import type { ILogin } from '@/types';

import { auth } from '@/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const apiInstance = ky.create({
  prefixUrl: API_URL,

  hooks: {
    beforeRequest: [
      async (request) => {
        /* const session = await auth();
        console.log('!!! session !!!', session);
        const token = session?.accessToken;

        console.log('!!! token !!!', token);*/

        request.headers.set(
          'Authorization',
          `Bearer 56128|SStnnfh3CWm5bjp6hAvZPadE8B1CM650NL6PsTzZf221f3ff`,
        );
      },
    ],
  },
});

export const api = {
  auth: {
    login: (data: ILogin) =>
      apiInstance.post('medical-centre/login', { json: data }),
  },

  profile: {
    get: () => apiInstance.post('medical-centre/profile'),
  },
};
