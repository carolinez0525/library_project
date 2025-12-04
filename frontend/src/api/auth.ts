import request from '@/utils/request';
import type { User } from '@/types/index';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
  role: 'Reader' | 'Librarian';
}

export interface LoginResponse {
  message: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
}

export const login = async (params: LoginParams): Promise<LoginResponse> => {
  const response = await request.post<LoginResponse>('/login/', params);
  return response.data;
};

export const register = async (params: RegisterParams): Promise<LoginResponse> => {
  console.log("Sending request .... !!!");
  const response = await request.post<LoginResponse>('/register/', params);
  console.log(response);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await request.post('/logout/');
};

export const getUserProfile = async (): Promise<User> => {
  const response = await request.get<User>('/users/me/');
  return response.data;
};

export const updateUserProfile = async (data: Partial<User>): Promise<User> => {
  const response = await request.patch<User>('/users/me/', data);
  return response.data;
};

// 获取当前用户信息
export const getCurrentUser = async (): Promise<User> => {
  const response = await request.get<User>('/users/me/');
  return response.data;
}; 