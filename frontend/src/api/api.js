// Base URL for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = getToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    credentials: 'include', // Include cookies if needed
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }

  // Return empty object if no content
  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// Fetch with custom token (for auth verification)
async function fetchApiWithToken(endpoint, token, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const response = await fetch(url, { ...defaultOptions, ...options });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
}

// API methods
export const api = {
  // GET request
  get: (endpoint) => fetchApi(endpoint, { method: 'GET' }),

  // GET request with custom token
  getWithToken: (endpoint, token) => fetchApiWithToken(endpoint, token, { method: 'GET' }),

  // POST request
  post: (endpoint, data) =>
    fetchApi(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // PUT request
  put: (endpoint, data) =>
    fetchApi(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // DELETE request
  delete: (endpoint) => fetchApi(endpoint, { method: 'DELETE' }),
};

export default api;
