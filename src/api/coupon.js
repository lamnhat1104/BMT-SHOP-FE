import { fetchData } from './config';

export const couponApi = {
  getAllCoupons: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.showHidden !== undefined) query.append('showHidden', params.showHidden);
    const queryString = query.toString();
    return fetchData(`/coupons${queryString ? '?' + queryString : ''}`, {
      method: 'GET',
    });
  },

  getCouponById: async (id) => {
    return fetchData(`/coupons/${id}`, {
      method: 'GET',
    });
  },

  createCoupon: async (couponData) => {
    return fetchData('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  },

  updateCoupon: async (id, couponData) => {
    return fetchData(`/coupons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(couponData),
    });
  },

  deleteCoupon: async (id) => {
    return fetchData(`/coupons/${id}`, {
      method: 'DELETE',
    });
  }
};
