import { apiHelper } from '../../../helpers/apiHelper';

const lostFoundApi = (() => {
  async function getAllLostFounds({ type = '', is_completed = '', is_me = '', search = '' } = {}) {
    let query = '';
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (is_completed !== '') params.append('is_completed', is_completed);
    if (is_me !== '') params.append('is_me', is_me);
    if (search) params.append('search', search);

    if (params.toString()) {
      query = `?${params.toString()}`;
    }

    const response = await apiHelper(`/lost-founds${query}`);
    return response.data;
  }

  async function getLostFoundById(id) {
    const response = await apiHelper(`/lost-founds/${id}`);
    return response.data;
  }

  async function addLostFound({ title, description, type, location, image }) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('location', location);
    if (image) {
      formData.append('image', image);
    }

    const response = await apiHelper('/lost-founds', {
      method: 'POST',
      data: formData,
      isFormData: true,
    });
    return response.data;
  }

  async function updateLostFound(id, { title, description, type, location, is_completed }) {
    const response = await apiHelper(`/lost-founds/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ title, description, type, location, is_completed }),
    });
    return response.data;
  }

  async function updateLostFoundCover(id, image) {
    const formData = new FormData();
    formData.append('image', image);

    const response = await apiHelper(`/lost-founds/${id}/cover`, {
      method: 'POST',
      data: formData,
      isFormData: true,
    });
    return response.data;
  }

  async function deleteLostFound(id) {
    const response = await apiHelper(`/lost-founds/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  }

  async function getDailyStats() {
    const response = await apiHelper('/lost-founds/stats/daily');
    return response.data;
  }

  async function getMonthlyStats() {
    const response = await apiHelper('/lost-founds/stats/monthly');
    return response.data;
  }

  return {
    getAllLostFounds,
    getLostFoundById,
    addLostFound,
    updateLostFound,
    updateLostFoundCover,
    deleteLostFound,
    getDailyStats,
    getMonthlyStats,
  };
})();

export default lostFoundApi;