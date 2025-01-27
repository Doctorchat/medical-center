import ky from 'ky';
import { getSession } from 'next-auth/react';

import { API_URL } from '@/utils/constants';

export const apiInstance = ky.create({
  prefixUrl: API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        const session = await getSession();
        const token = session?.accessToken;

        request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
  },
});
