import ky from 'ky';
import { signOut } from 'next-auth/react';

import { API_URL } from '@/utils/constants';
import type { ILogin } from '@/types';

class AuthService {
  private authApi = ky.create({
    prefixUrl: API_URL,
  });

  login(data: ILogin) {
    return this.authApi.post('medical-centre/login', { json: data });
  }

  async logout() {
    await signOut();
  }
}

export const authService = new AuthService();
