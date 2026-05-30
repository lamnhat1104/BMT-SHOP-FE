import { fetchData } from './config';

export const adminApi = {
  getDashboardStats: async () => {
    return fetchData('/admin/dashboard', {
      method: 'GET',
    });
  },

  getUsers: async () => {
    return fetchData('/admin/users', {
      method: 'GET',
    });
  },

  updateUserRole: async (userId, role) => {
    return fetchData(`/admin/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  updateUserStatus: async (userId, isActive) => {
    return fetchData(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isActive }),
    });
  },

  createProduct: async (productData) => {
    return fetchData('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (productId, productData) => {
    return fetchData(`/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (productId) => {
    return fetchData(`/admin/products/${productId}`, {
      method: 'DELETE',
    });
  },

  updateProductStock: async (productId, stock) => {
    return fetchData(`/admin/products/${productId}/stock`, {
      method: 'PUT',
      body: JSON.stringify({ stock }),
    });
  }
};
