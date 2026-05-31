import { fetchData } from './config';

export const categoryApi = {
  getAllCategories: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.showHidden !== undefined) query.append('showHidden', params.showHidden);
    const queryString = query.toString();
    return fetchData(`/categories${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
    });
  },
  
  getCategoryById: async (id) => {
    return fetchData(`/categories/${id}`, {
      method: 'GET',
    });
  },

  createCategory: async (categoryData) => {
    return fetchData('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: async (id, categoryData) => {
    return fetchData(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  deleteCategory: async (id) => {
    return fetchData(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
};
