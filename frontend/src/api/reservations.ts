import request from '@/utils/request';
import type { Reservation } from '@/types';

export const getReservations = async (): Promise<{ results: Reservation[] }> => {
  const response = await request.get<{ results: Reservation[] }>('/reserves/');
  return response.data;
};

export const getReservationById = async (id: number): Promise<Reservation> => {
  const response = await request.get<Reservation>(`/reserves/${id}/`);
  return response.data;
};

export const createReservation = async (isbn: string): Promise<Reservation> => {
  const response = await request.post<Reservation>('/reserves/', { isbn, status: 'Pending' });
  return response.data;
};

export const cancelReservation = async (id: number): Promise<void> => {
  await request.post(`/reservations/${id}/cancel/`);
}; 