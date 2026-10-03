import { apiHelper } from '../../../helpers/apiHelper';

export const userApi = {
  async getAllUsers() {
    const response = await apiHelper('/users', { method: 'GET' });
    return response;
  },

  async getProfile() {
    const response = await apiHelper('/users/me', { method: 'GET' });
    return response;
  },

  async updateProfile({ name }) {
    const response = await apiHelper('/users/me', {
      method: 'PUT',
      data: { name },
    });
    return response;
  },

  async updatePhoto(formData) {
    const response = await apiHelper('/users/me/photo', {
      method: 'POST',
      data: formData,
      isFormData: true,
    });
    return response;
  },

  async updatePassword({ old_password, new_password }) {
    const response = await apiHelper('/users/me/password', {
      method: 'PUT',
      data: { old_password, new_password },
    });
    return response;
  },
};