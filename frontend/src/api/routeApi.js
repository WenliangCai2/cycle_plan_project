/**
 * Route related API services
 */
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Get all routes for a user
 * @returns {Promise} - Promise containing list of routes
 */
export const getRoutes = async () => {
  try {
    const response = await api.get('/routes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to get routes' };
  }
};

/**
 * Create a new route
 * @param {Object} route - Route information
 * @param {string} route.name - Route name
 * @param {Array} route.locations - Locations included in the route
 * @returns {Promise} - Promise containing creation result
 */
export const createRoute = async (route) => {
  try {
    const response = await api.post('/routes', { route });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to create route' };
  }
};

/**
 * Delete a route
 * @param {string} routeId - Route ID
 * @returns {Promise} - Promise containing deletion result
 */
export const deleteRoute = async (routeId) => {
  try {
    const response = await api.delete(`/routes/${routeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to delete route' };
  }
};

export default {
  getRoutes,
  createRoute,
  deleteRoute,
}; 