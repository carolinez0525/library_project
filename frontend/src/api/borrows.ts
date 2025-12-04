import request from '@/utils/request';
import type { Borrowing } from '@/types';

export const borrowBook = async (bookId: number): Promise<void> => {
  await request.post(`/borrows/`, { book_id: bookId });
};

export const returnBook = async (bookId: number): Promise<void> => {
  await request.post(`/borrows/${bookId}/return/`);
};

export const getBorrowings = async (dateRange?: [string, string] | null): Promise<Borrowing[]> => {
  const params: Record<string, string> = {};
  if (dateRange) {
    params.start_date = dateRange[0];
    params.end_date = dateRange[1];
  }
  const response = await request.get('/borrows/', { params });
  const borrowings = response.data || [];

  // 获取每个借阅记录对应的完整书籍和用户信息
  const borrowingsWithFullInfo = await Promise.all(
    borrowings.map(async (borrowing) => {
      const [bookResponse, userResponse] = await Promise.all([
        request.get(`/books/${borrowing.book}/`),
        request.get(`/users/${borrowing.user}/`)
      ]);
      return {
        ...borrowing,
        book: bookResponse.data,
        user: userResponse.data
      };
    })
  );

  return borrowingsWithFullInfo;
};

export const getBorrowingById = async (id: number): Promise<Borrowing> => {
  const response = await request.get<Borrowing>(`/borrows/${id}/`);
  return response.data;
};

export const markReturned = async (borrowId: number): Promise<void> => {
  await request.post(`/borrows/${borrowId}/mark_returned/`);
};