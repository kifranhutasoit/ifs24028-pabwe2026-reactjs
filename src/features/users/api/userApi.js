import { apiHelper } from "@/helpers/apiHelper";

export async function getAllUsers() {
  const response = await apiHelper('/users', { method: 'GET' });
  return response;
}

export async function getProfileMe() {
  const response = await apiHelper('/users/me', { method: 'GET' });
  return response;
}

export async function updateProfile({ name }) {
  const response = await apiHelper('/users/me', {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
  return response;
}

export async function updateProfilePhoto(formData) {
  const response = await apiHelper('/users/me/photo', {
    method: 'POST',
    body: formData, // FormData berisi file foto
  });
  return response;
}

export async function updatePassword({ old_password, password, password_confirmation }) {
  const response = await apiHelper('/users/me/password', {
    method: 'PUT',
    body: JSON.stringify({ old_password, password, password_confirmation }),
  });
  return response;
}