import { fetchData } from './config';

export const reviewApi = {
  getAllReviews: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.showHidden !== undefined) query.append('showHidden', params.showHidden);
    const queryString = query.toString();
    return fetchData(`/admin/reviews${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
    });
  },

  deleteReview: async (id) => {
    return fetchData(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  }
};
