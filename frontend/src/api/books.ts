import request from '../utils/request';

export interface Book {
  book_id: number;
  title: string;
  author: string;
  isbn: string;
  category: string;
  shelf_loc: string;
  status: 'Available' | 'Borrowed' | 'Reserved';
  description?: string;
  publish_date?: string;
}

export interface BookResponse {
  results: Book[];
  count: number;
}

export interface BookQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
}

// 获取图书列表
export const getBooks = async (params: BookQueryParams): Promise<BookResponse> => {
  const response = await request.get<Book[]>('/books/', { params });
  return {
    results: response.data,
    count: response.data.length
  };
};

// 创建图书
export const createBook = async (data: Omit<Book, 'book_id'>): Promise<Book> => {
  const response = await request.post<Book>('/books/', data);
  return response.data;
};

// 更新图书
export const updateBook = async (id: number, data: Partial<Book>): Promise<Book> => {
  const response = await request.patch<Book>(`/books/${id}/`, data);
  return response.data;
};

// 删除图书
export const deleteBook = async (id: number): Promise<void> => {
  await request.delete(`/books/${id}/`);
};

// 借阅图书
export const borrowBook = async (bookId: number, dueDate: string): Promise<BorrowRecord> => {
  const response = await request.post<BorrowRecord>(`/borrows/`, {
    book: bookId,
    borrow_date: new Date().toISOString().split('T')[0],  // 当前日期
    due_date: dueDate,
    user: 1  // TODO: 从用户上下文获取当前用户ID
  });
  return response.data;
}; 