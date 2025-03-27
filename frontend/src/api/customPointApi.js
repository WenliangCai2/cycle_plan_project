/**
 * 自定义标记点相关API服务
 */
import axios from 'axios';

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 创建axios实例
const api = axios.create({
  baseURL: API_BASE_URL,
  // 使所有请求变为非简单请求，触发浏览器的CORS预检请求
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
 * 获取用户的所有自定义标记点
 * @returns {Promise} - 包含自定义标记点列表的Promise
 */
export const getCustomPoints = async () => {
  try {
    const response = await api.get('/custom-points');
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: '获取自定义点失败' };
  }
};

/**
 * 创建新的自定义标记点
 * @param {Object} point - 点信息
 * @param {string} point.name - 点名称
 * @param {Object} point.location - 点位置
 * @param {number} point.location.lat - 纬度
 * @param {number} point.location.lng - 经度
 * @returns {Promise} - 包含创建结果的Promise
 */
export const createCustomPoint = async (point) => {
  try {
    const response = await api.post('/custom-points', { point });
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: '创建自定义点失败' };
  }
};

/**
 * 删除自定义标记点
 * @param {string} pointId - 点ID
 * @returns {Promise} - 包含删除结果的Promise
 */
export const deleteCustomPoint = async (pointId) => {
  try {
    const response = await api.delete(`/custom-points/${pointId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { success: false, message: '删除自定义点失败' };
  }
};

export default {
  getCustomPoints,
  createCustomPoint,
  deleteCustomPoint,
}; 