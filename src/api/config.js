export const BASE_URL = 'http://localhost:8080/api';

/**
 * Generic fetch wrapper to handle JSON parsing and errors uniformly.
 */
export async function fetchData(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const token = localStorage.getItem('token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, fetchOptions);
    
    // Attempt to parse JSON response, fallback to text if not JSON
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('fullName');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('cartUpdated'));
      }
      let errorMessage = 'Có lỗi xảy ra';
      if (data && typeof data === 'object') {
        if (typeof data.message === 'string' && data.message.trim() !== '') {
          errorMessage = data.message;
        } else if (typeof data.error === 'string' && data.error.trim() !== '') {
          errorMessage = data.error;
        } else if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
          errorMessage = data.error.message;
        } else {
          errorMessage = JSON.stringify(data);
        }
      } else if (typeof data === 'string' && data.trim() !== '') {
        errorMessage = data;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}
