import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, Descriptions, Button, Rate, List, Form, Input, message, Space, Tag } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBooks } from '../../api/books';
import { borrowBook, returnBook } from '../../api/borrows';
import { getReviews, createReview } from '../../api/reviews';
import type { Book, Review, ApiError } from '../../types/index';

const { TextArea } = Input;

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: book, isLoading: bookLoading } = useQuery<Book>({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await getBooks({ page: 1, page_size: 1, search: id });
      const apiBook = response.results[0];
      return {
        id: apiBook.book_id,
        title: apiBook.title,
        author: apiBook.author,
        isbn: apiBook.isbn,
        publisher: 'Unknown',
        publish_date: apiBook.publish_date || '',
        category: apiBook.category,
        location: apiBook.shelf_loc,
        status: apiBook.status,
        description: apiBook.description || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
  });

  const { data: reviewsData, isLoading: reviewsLoading } = useQuery<{ results: Review[] }>({
    queryKey: ['reviews', id],
    queryFn: () => getReviews(Number(id)),
  });

  const borrowMutation = useMutation<void, ApiError, number>({
    mutationFn: borrowBook,
    onSuccess: () => {
      message.success('Book borrowed successfully!');
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
    onError: (error) => {
      message.error(error.message || 'Failed to borrow book. Please try again!');
    },
  });

  const returnMutation = useMutation<void, ApiError, number>({
    mutationFn: returnBook,
    onSuccess: () => {
      message.success('Book returned successfully!');
      queryClient.invalidateQueries({ queryKey: ['book', id] });
    },
    onError: (error) => {
      message.error(error.message || 'Failed to return book. Please try again!');
    },
  });

  const reviewMutation = useMutation<Review, ApiError, { bookId: number; rating: number; comment: string }>({
    mutationFn: ({ bookId, rating, comment }) => createReview(bookId, { rating, comment }),
    onSuccess: () => {
      message.success('Review submitted successfully!');
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['reviews', id] });
    },
    onError: (error) => {
      message.error(error.message || 'Failed to submit review. Please try again!');
    },
  });

  const handleBorrow = () => {
    if (id) {
      borrowMutation.mutate(Number(id));
    }
  };

  const handleReturn = () => {
    if (id) {
      returnMutation.mutate(Number(id));
    }
  };

  const handleReview = (values: { rating: number; comment: string }) => {
    if (id) {
      reviewMutation.mutate({
        bookId: Number(id),
        rating: values.rating,
        comment: values.comment,
      });
    }
  };

  if (bookLoading) {
    return <div>Loading...</div>;
  }

  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div className="p-6">
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
              <Space>
                <Tag color={book.status === 'Available' ? 'success' : 'error'}>
                  {book.status === 'Available' ? 'Available' : book.status === 'Borrowed' ? 'Borrowed' : 'Reserved'}
                </Tag>
              </Space>
            </div>
            <Space>
              {book.status === 'Available' && (
                <Button type="primary" onClick={handleBorrow} loading={borrowMutation.isPending}>
                  Borrow
                </Button>
              )}
              {book.status === 'Borrowed' && (
                <Button onClick={handleReturn} loading={returnMutation.isPending}>
                  Return
                </Button>
              )}
            </Space>
          </div>

          <Descriptions column={2}>
            <Descriptions.Item label="Author">{book.author}</Descriptions.Item>
            <Descriptions.Item label="ISBN">{book.isbn}</Descriptions.Item>
            <Descriptions.Item label="Publisher">{book.publisher}</Descriptions.Item>
            <Descriptions.Item label="Publish Date">{book.publish_date}</Descriptions.Item>
            <Descriptions.Item label="Category">{book.category}</Descriptions.Item>
            <Descriptions.Item label="Location">{book.location}</Descriptions.Item>
          </Descriptions>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-600">{book.description}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Reviews</h2>
            <Form form={form} onFinish={handleReview} className="mb-6">
              <Form.Item
                name="rating"
                label="Rating"
                rules={[{ required: true, message: 'Please select a rating' }]}
              >
                <Rate />
              </Form.Item>
              <Form.Item
                name="comment"
                label="Comment"
                rules={[{ required: true, message: 'Please enter your comment' }]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={reviewMutation.isPending}>
                  Submit Review
                </Button>
              </Form.Item>
            </Form>

            <List
              loading={reviewsLoading}
              dataSource={reviewsData?.results}
              renderItem={(review) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Space>
                        <Rate disabled defaultValue={review.rating} />
                        <span>{review.comment}</span>
                      </Space>
                    }
                    description={new Date(review.created_at).toLocaleString()}
                  />
                </List.Item>
              )}
            />
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default BookDetail; 