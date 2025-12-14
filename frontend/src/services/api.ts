import axios from 'axios';

// Update this URL based on your environment
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export interface User {
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface swipeRequest {
  swiper_user_id: number;
  target_profile_id: number;
  action: "like" | "pass";
}

export const checkHealth = async () => {
  const response = await api.get<ApiResponse<{ status: string; time: string }>>('/health');
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get<ApiResponse<User[]>>('/users');
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await api.post<ApiResponse<User>>('/users', user);
  return response.data;
};

export const createSwipe = async (swipe: swipeRequest) => {
  const response = await api.post<ApiResponse<any>>("/swipes", swipe)
  return response.data
}

export default api;

