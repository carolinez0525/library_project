import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  BookOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { getLibraryStats, getUserStats } from "../../api/stats";
import type { LibraryStats, UserStats } from "../../api/stats";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const HomePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<LibraryStats | UserStats>({
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
        if (user?.role === "Reader" && user?.id) {
          const data = await getUserStats(user.id);
          setStats(data);
        } else {
          const data = await getLibraryStats();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div>
      <h2>Dashboard</h2>
      <Row gutter={16}>
        <Col span={user?.role === "Reader" ? 12 : 8}>
          <Card>
            <Statistic
              title="Total Books"
              value={stats.totalBooks}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        {user?.role !== "Reader" && (
          <Col span={8}>
            <Card>
              <Statistic
                title="Total Users"
                value={stats.totalUsers}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
        )}
        <Col span={user?.role === "Reader" ? 12 : 8}>
          <Card>
            <Statistic
              title={
                user?.role === "Reader"
                  ? "Your Borrowed Books"
                  : "Total Borrowed Books"
              }
              value={stats.borrowedBooks}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
