// Base URL for the Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Parse error response from backend
async function parseErrorResponse(response) {
  try {
    const text = await response.text();
    if (text) {
      const errorData = JSON.parse(text);
      // Handle structured error response from GlobalExceptionHandler
      if (errorData.message) {
        return errorData.message;
      }
      if (errorData.fieldErrors) {
        // Return first field error for display
        const firstError = Object.values(errorData.fieldErrors)[0];
        return firstError;
      }
      if (errorData.error) {
        return errorData.error;
      }
    }
    return 'Something went wrong';
  } catch {
    return 'Something went wrong';
  }
}

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
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage);
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
    const errorMessage = await parseErrorResponse(response);
    throw new Error(errorMessage);
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
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PATCH request
  patch: (endpoint, data) =>
    fetchApi(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: (endpoint) => fetchApi(endpoint, { method: 'DELETE' }),
};

export default api;
