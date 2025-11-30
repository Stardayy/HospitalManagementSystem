// Base URL for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Generic fetch wrapper with error handling
async function fetchApi(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
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

// API methods
export const api = {
  // GET request
  get: (endpoint) => fetchApi(endpoint, { method: 'GET' }),

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
