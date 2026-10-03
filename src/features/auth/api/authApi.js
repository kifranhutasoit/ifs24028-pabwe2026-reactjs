import { apiHelper } from "@/helpers/apiHelper";
import { showSuccessDialog } from "@/helpers/toolsHelper";

export async function login({ email, password }) {
  const response = await apiHelper('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  return response;
}

export async function register({ name, email, password, password_confirmation }) {
  const response = await apiHelper('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, password_confirmation }),
  });
  return response;
}

export async function getMe() {
  const response = await apiHelper('/users/me', {
    method: 'GET',
  });
  return response;
}