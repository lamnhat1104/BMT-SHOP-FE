import { fetchData } from './config';

export const cartApi = {
  getCart: async () => {
    return fetchData('/cart');
  },
  
  addCartItem: async (productId, quantity, details) => {
    return fetchData('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity, details }),
    });
  },
  
  updateQty: async (productId, quantity, details) => {
    return fetchData(`/cart/${productId}?quantity=${quantity}&details=${encodeURIComponent(details)}`, {
      method: 'PUT',
    });
  },
  
  removeItem: async (productId, details) => {
    return fetchData(`/cart/${productId}?details=${encodeURIComponent(details)}`, {
      method: 'DELETE',
    });
  },
  
  clearCart: async () => {
    return fetchData('/cart', {
      method: 'DELETE',
    });
  }
};
