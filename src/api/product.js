import { fetchData } from './config';

export const productApi = {
  getAllProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.sort) query.append('sort', params.sort);
    if (params.brand) query.append('brand', params.brand);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    
    const queryString = query.toString();
    return fetchData(`/products${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
    });
  },
  
  getProductById: async (id) => {
    return fetchData(`/products/${id}`, {
      method: 'GET',
    });
  }
};
