import type { AxiosRequestConfig } from 'axios';

export interface User {
  id: number;
  username: string;
  email: string;
  role: 'Reader' | 'Librarian';
  is_staff: boolean;
  is_superuser: boolean;
  date_joined?: string;
  last_login?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publish_date: string;
  category: string;
  location: string;
  status: 'Available' | 'Borrowed' | 'Reserved';
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Borrowing {
  borrow_id: number;
  book: Book;
  user: User;
  borrow_date: string;
  due_date: string;
  return_date?: string;
  status: 'Active' | 'Overdue' | 'Returned';
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: number;
  book: Book;
  user: User;
  reserve_date: string;
  expiry_date: string;
  status: 'Pending' | 'Fulfilled' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: number;
  book: Book;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface BookQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  status?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    hideLoading?: boolean;
  }
} 