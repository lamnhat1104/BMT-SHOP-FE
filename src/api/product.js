import { fetchData } from './config';

export const productApi = {
  getAllProducts: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.keyword) query.append('keyword', params.keyword);
    if (params.sort) query.append('sort', params.sort);
    if (params.brand) query.append('brand', params.brand);
    if (params.categoryId) query.append('categoryId', params.categoryId);
    if (params.showHidden !== undefined) query.append('showHidden', params.showHidden);
    if (params.minPrice !== undefined && params.minPrice !== null) query.append('minPrice', params.minPrice);
    if (params.maxPrice !== undefined && params.maxPrice !== null) query.append('maxPrice', params.maxPrice);
    
    const queryString = query.toString();
    return fetchData(`/products${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
    });
  },

  autocompleteSearch: async (keyword) => {
    return fetchData(`/products/autocomplete?keyword=${encodeURIComponent(keyword)}`, {
      method: 'GET',
    });
  },
  
  getProductById: async (id) => {
    return fetchData(`/products/${id}`, {
      method: 'GET',
    });
  },

  createProduct: async (productData) => {
    return fetchData('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  updateProduct: async (id, productData) => {
    return fetchData(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  deleteProduct: async (id) => {
    return fetchData(`/products/${id}`, {
      method: 'DELETE',
    });
  }
};
