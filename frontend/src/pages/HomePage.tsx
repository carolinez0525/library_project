import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { BookOutlined, UserOutlined, CheckCircleOutlined, TeamOutlined } from '@ant-design/icons';
import { getLibraryStats } from '../api/stats';
import type { LibraryStats } from '../api/stats';

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<LibraryStats>({
    totalBooks: 0,
    totalUsers: 0,
    borrowedBooks: 0,
    userRoles: {
      readers: 0,
      librarians: 0,
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getLibraryStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch library stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1>Library Management System</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Books"
              value={stats.totalBooks}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Borrowed Books"
              value={stats.borrowedBooks}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="User Roles"
              value={stats.userRoles.readers}
              suffix={`/ ${stats.userRoles.librarians}`}
              prefix={<TeamOutlined />}
              valueStyle={{ fontSize: '16px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage; 