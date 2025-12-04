import request from '../utils/request';
import type { Book, User } from '@/types';

export interface LibraryStats {
  totalBooks: number;
  totalUsers: number;
  borrowedBooks: number;
  userRoles: {
    readers: number;
    librarians: number;
  };
}

export interface UserStats {
  totalBooks: number;
  borrowedBooks: number;
}

export const getUserStats = async (userId: string): Promise<UserStats> => {
  // 获取所有图书
  const booksResponse = await request.get<Book[]>('/books/');
  const books = booksResponse.data;

  // 获取用户的借阅记录
  const borrowingsResponse = await request.get('/borrows/');
  const borrowings = borrowingsResponse.data || [];

  // 计算当前借阅的图书数量（未归还的借阅记录）
  const borrowedBooks = borrowings.filter(borrowing => !borrowing.return_date).length;

  return {
    totalBooks: books.length,
    borrowedBooks,
  };
};

export const getLibraryStats = async (): Promise<LibraryStats> => {
  // 获取所有图书
  const booksResponse = await request.get<Book[]>('/books/');
  const books = booksResponse.data;

  // 获取所有用户
  const usersResponse = await request.get<User[]>('/users/');
  const users = usersResponse.data;

  // 计算统计数据
  return {
    totalBooks: books.length,
    totalUsers: users.length,
    borrowedBooks: books.filter(book => book.status === 'Borrowed').length,
    userRoles: {
      readers: users.filter(user => user.role === 'Reader').length,
      librarians: users.filter(user => user.role === 'Librarian').length,
    },
  };
};