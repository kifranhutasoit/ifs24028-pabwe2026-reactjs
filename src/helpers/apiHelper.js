const TOKEN_KEY = 'ACCESS_TOKEN';

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function putAccessToken(token) {
  return localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

export async function apiHelper(endpoint, options = {}) {
  const token = getAccessToken();
  const headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    headers['Accept'] = 'application/json';
  }

  try {
    const response = await fetch(`${DELCOM_BASEURL}${endpoint}`, {
      ...options,
      headers,
    });

    let responseJson;
    try {
      responseJson = await response.json();
    } catch {
      responseJson = {
        status: response.ok ? 'success' : 'fail',
        message: response.statusText || 'Terjadi kesalahan format respon dari server',
      };
    }

    return responseJson;
  } catch (error) {
    return {
      status: 'error',
      message: error?.message || 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
    };
  }
}