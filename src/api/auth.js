import { fetchData } from './config';

export const authApi = {
  login: async (emailOrPhone, password) => {
    return fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: emailOrPhone, password }),
    });
  },
  
  register: async (fullName, phoneNumber, email, password) => {
    return fetchData('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, phone: phoneNumber, email, password }),
    });
  },

  checkEmailExists: async (email) => {
    return fetchData(`/auth/check-email?email=${encodeURIComponent(email)}`, {
      method: 'GET',
    });
  },

  checkPhoneExists: async (phone) => {
    return fetchData(`/auth/check-phone?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
    });
  },

  verifyOtp: async (email, otp) => {
    return fetchData('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  forgotPassword: async (email) => {
    return fetchData('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token, newPassword) => {
    return fetchData('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  },

  getProfile: async () => {
    return fetchData('/users/profile', {
      method: 'GET',
    });
  },

  updateProfile: async (profileData) => {
    return fetchData('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }
};
