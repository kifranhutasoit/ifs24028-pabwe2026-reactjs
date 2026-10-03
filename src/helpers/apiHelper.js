const DELCOM_BASEURL = import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';

export const getAccessToken = () => {
  return localStorage.getItem('accessToken');
};

export const putAccessToken = (token) => {
  localStorage.setItem('accessToken', token);
};

export const apiHelper = async (endpoint, options = {}) => {
  const { method = 'GET', data = null, params = {}, headers = {}, isFormData = false } = options;

  // --- MOCK MODE SEMENTARA KARENA SERVER 502 ---
  if (endpoint.includes('/auth/register') || endpoint.includes('/auth/login')) {
    // Simulasi sukses untuk autentikasi
    return {
      success: true,
      message: 'Berhasil (Mock Mode)',
      data: {
        token: 'mock-jwt-token-12345',
        user: { id: 1, name: 'Rachel N Gurning', email: 'rachel@email.com' }
      }
    };
  }
  // ---------------------------------------------

  let url = `${DELCOM_BASEURL}${endpoint}`;
  
  if (Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const token = getAccessToken();
  const defaultHeaders = {};

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  };

  if (data) {
    config.body = isFormData ? data : JSON.stringify(data);
  }

  try {
    const response = await fetch(url, config);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      success: false,
      message: 'Server pusat sedang gangguan (502 Bad Gateway). Gunakan Mock Mode.',
    };
  }
};