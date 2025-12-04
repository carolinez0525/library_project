import request from '@/utils/request';
import type { Review } from '@/types';

export interface CreateReviewParams {
  rating: number;
  comment: string;
}

export const getReviews = async (bookId: number): Promise<{ results: Review[] }> => {
  const response = await request.get<{ results: Review[] }>(`/books/${bookId}/reviews/`);
  return response.data;
};

export const createReview = async (bookId: number, data: CreateReviewParams): Promise<Review> => {
  const response = await request.post<Review>(`/books/${bookId}/reviews/`, data);
  return response.data;
};

export const updateReview = async (bookId: number, reviewId: number, data: Partial<CreateReviewParams>): Promise<Review> => {
  const response = await request.patch<Review>(`/books/${bookId}/reviews/${reviewId}/`, data);
  return response.data;
};

export const deleteReview = async (bookId: number, reviewId: number): Promise<void> => {
  await request.delete(`/books/${bookId}/reviews/${reviewId}/`);
}; 