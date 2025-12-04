import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getBooks } from '@/api/books';
import type { Book } from '@/types';

const AdminHome: React.FC = () => {
  const { data: booksData, isLoading } = useQuery<{ results: Book[] }>({
    queryKey: ['books'],
    queryFn: () => getBooks({ page: 1, page_size: 10 }),
  });

  const columns = [
    {
      title: '书名',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={status === 'Available' ? 'text-green-500' : 'text-red-500'}>
          {status === 'Available' ? '可借阅' : status === 'Borrowed' ? '已借出' : '已预约'}
        </span>
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
    },
  ];

  return (
    <div className="p-6">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总藏书量"
              value={booksData?.results.length || 0}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="可借阅"
              value={booksData?.results.filter(book => book.status === 'Available').length || 0}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已借出"
              value={booksData?.results.filter(book => book.status === 'Borrowed').length || 0}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已预约"
              value={booksData?.results.filter(book => book.status === 'Reserved').length || 0}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="最近借阅" className="mt-6">
        <Table
          columns={columns}
          dataSource={booksData?.results}
          rowKey="id"
          loading={isLoading}
        />
      </Card>
    </div>
  );
};

export default AdminHome; 