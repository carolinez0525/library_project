import request from '@/utils/request';
import type { User } from '@/types';

export interface UserQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
}

export const getUsers = async (params: UserQueryParams): Promise<{ results: User[] }> => {
  const response = await request.get<{ results: User[] }>('/users/', { params });
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await request.get<User>(`/users/${id}/`);
  return response.data;
};

export const updateUser = async (id: number, data: Partial<User>): Promise<User> => {
  const response = await request.patch<User>(`/users/${id}/`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await request.delete(`/users/${id}/`);
}; 