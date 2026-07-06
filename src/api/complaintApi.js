import { fetchData, BASE_URL } from './config';

export const complaintApi = {
  createComplaint: async (orderId, reason, description, file) => {
    const formData = new FormData();
    formData.append('orderId', orderId);
    formData.append('reason', reason);
    formData.append('description', description);
    
    if (file) {
      formData.append('file', file);
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/complaints`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
        const err = await response.text();
        throw new Error(err || 'Failed to submit complaint');
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return response.json();
    }
    return response.text();
  },

  getMyComplaints: async () => {
    return fetchData(`/complaints`, {
      method: 'GET',
    });
  },

  createRefundRequest: async (complaintId, refundData) => {
    return fetchData(`/complaints/${complaintId}/refund`, {
      method: 'POST',
      body: JSON.stringify(refundData)
    });
  },

  getAllComplaints: async () => {
    return fetchData(`/admin/complaints`, {
      method: 'GET',
    });
  },

  updateComplaintStatus: async (id, status) => {
    return fetchData(`/admin/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  updateRefundStatus: async (id, status) => {
    return fetchData(`/admin/complaints/refunds/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  }
};
