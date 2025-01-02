import ky from 'ky';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const token = 'token';

const apiInstance = ky.create({
  prefixUrl: API_URL,
  // headers: {
  //   accept: 'application/json',
  //   Authorization: token ? `Bearer ${token}` : 'Bearer ',
  // },
  hooks: {
    beforeRetry: [
      async ({ request }) => {
        request.headers.set('Authorization', `token ${token}`);
      },
    ],
  },
});

export const api = {
  auth: {
    login: (data: Partial<Record<'email' | 'password', unknown>>) =>
      apiInstance.post('medical-centre/login', { json: data }),
  },
};
