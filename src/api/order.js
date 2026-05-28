import { fetchData } from './config';

export const orderApi = {
  createOrder: async (orderData) => {
    return fetchData('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  getMyOrders: async () => {
    return fetchData('/orders');
  },

  getAdminOrders: async () => {
    return fetchData('/orders/admin');
  },

  updateOrderStatus: async (orderId, status) => {
    return fetchData(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  cancelOrder: async (orderId) => {
    return fetchData(`/orders/${orderId}/cancel`, {
      method: 'PUT',
    });
  },

  trackOrder: async (orderCode, phone) => {
    return fetchData(`/orders/track?orderCode=${encodeURIComponent(orderCode)}&phone=${encodeURIComponent(phone)}`);
  }
};
