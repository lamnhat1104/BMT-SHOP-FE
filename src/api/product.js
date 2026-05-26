import { fetchData } from './config';

export const productApi = {
  getAllProducts: async () => {
    return fetchData('/products', {
      method: 'GET',
    });
  },
  
  getProductById: async (id) => {
    return fetchData(`/products/${id}`, {
      method: 'GET',
    });
  }
};
