import React from 'react';
import { Card, List, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '@/api/books';
import type { Book } from '@/types';

const { Title } = Typography;

const ReaderHome: React.FC = () => {
  const navigate = useNavigate();

  const { data: booksData, isLoading } = useQuery<{ results: Book[] }>({
    queryKey: ['books'],
    queryFn: () => getBooks({ page: 1, page_size: 10 }),
  });

  const handleBookClick = (bookId: number) => {
    navigate(`/reader/books/${bookId}`);
  };

  return (
    <div className="p-6">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={4}>热门图书</Title>
          <List<Book>
            loading={isLoading}
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={booksData?.results || []}
            renderItem={(book) => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img alt={book.title} src={book.cover} style={{ height: 200, objectFit: 'cover' }} />}
                  onClick={() => handleBookClick(book.id)}
                >
                  <Card.Meta title={book.title} description={book.author} />
                </Card>
              </List.Item>
            )}
          />
        </Card>

        <Card>
          <Title level={4}>新书推荐</Title>
          <List<Book>
            loading={isLoading}
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
            dataSource={booksData?.results || []}
            renderItem={(book) => (
              <List.Item>
                <Card
                  hoverable
                  cover={<img alt={book.title} src={book.cover} style={{ height: 200, objectFit: 'cover' }} />}
                  onClick={() => handleBookClick(book.id)}
                >
                  <Card.Meta title={book.title} description={book.author} />
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </Space>
    </div>
  );
};

export default ReaderHome; 