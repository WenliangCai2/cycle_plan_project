/**
 * 路线相关API服务
 */
import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证token
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
 * 获取用户的所有路线
 * @returns {Promise} - 包含路线列表的Promise
 */
export const getRoutes = async () => {
  try {
    const response = await api.get('/routes');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: '获取路线失败' };
  }
};

/**
 * 创建新的路线
 * @param {Object} route - 路线信息
 * @param {string} route.name - 路线名称
 * @param {Array} route.locations - 路线包含的位置点
 * @returns {Promise} - 包含创建结果的Promise
 */
export const createRoute = async (route) => {
  try {
    const response = await api.post('/routes', { route });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: '创建路线失败' };
  }
};

/**
 * 删除路线
 * @param {string} routeId - 路线ID
 * @returns {Promise} - 包含删除结果的Promise
 */
export const deleteRoute = async (routeId) => {
  try {
    const response = await api.delete(`/routes/${routeId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: '删除路线失败' };
  }
};

export default {
  getRoutes,
  createRoute,
  deleteRoute,
}; 