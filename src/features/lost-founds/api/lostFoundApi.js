import { apiHelper } from "@/helpers/apiHelper";

export async function getLostFounds(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await apiHelper(`/lost-founds?${query}`, { method: 'GET' });
  return response;
}

export async function getLostFoundDetail(id) {
  const response = await apiHelper(`/lost-founds/${id}`, { method: 'GET' });
  return response;
}

export async function addLostFound(data) {
  const response = await apiHelper('/lost-founds', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response;
}

export async function updateLostFound(id, data) {
  const response = await apiHelper(`/lost-founds/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response;
}

export async function updateLostFoundCover(id, formData) {
  const response = await apiHelper(`/lost-founds/${id}/cover`, {
    method: 'POST',
    body: formData,
  });
  return response;
}

export async function deleteLostFound(id) {
  const response = await apiHelper(`/lost-founds/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function getLostFoundDailyStats() {
  const response = await apiHelper('/lost-founds/stats/daily', { method: 'GET' });
  return response;
}

export async function getLostFoundMonthlyStats() {
  const response = await apiHelper('/lost-founds/stats/monthly', { method: 'GET' });
  return response;
}