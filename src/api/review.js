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
  },

  getProductReviews: async (productId) => {
    return fetchData(`/reviews/product/${productId}`, {
      method: 'GET',
    });
  },

  createReview: async (orderId, productId, rating, comment, files) => {
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('productId', productId);
    formData.append('rating', rating);
    formData.append('comment', comment);
    
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });
    }

    const token = localStorage.getItem('token');
    // Using native fetch to avoid Content-Type json being set automatically
    const response = await fetch('http://localhost:8080/api/reviews', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to submit review');
    }
    
    // Check if it's JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
  }
};
