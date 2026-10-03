import { apiHelper } from '../../../helpers/apiHelper';

export const authApi = {
  async login({ email, password }) {
    const response = await apiHelper('/auth/login', {
      method: 'POST',
      data: { email, password },
    });
    return response;
  },

  async register({ name, email, password }) {
    const response = await apiHelper('/auth/register', {
      method: 'POST',
      data: { name, email, password },
    });
    return response;
  },
};