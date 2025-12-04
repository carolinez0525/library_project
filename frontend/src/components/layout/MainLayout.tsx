import React, { useState } from "react";
import { Layout, Menu, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  LogoutOutlined,
  HomeOutlined,
  BookOutlined,
  ReadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useFeedback } from "@/hooks/useFeedback";
import { logout } from "@/store/slices/authSlice";

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { modal } = useFeedback();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    modal.confirm({
      title: "Confirm Logout",
      content: "Are you sure you want to logout?",
      onOk: () => {
        dispatch(logout());
        navigate("/login");
      },
    });
  };

  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "/books",
      icon: <BookOutlined />,
      label: "Books",
    },
    {
      key: "/borrows",
      icon: <ReadOutlined />,
      label: "Borrowings",
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: "#001529" }}
      >
        <div
          style={{
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              color: "#fff",
              margin: 0,
              fontSize: collapsed ? "14px" : "18px",
            }}
          >
            Library
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{ borderRight: 0, background: "#001529", color: "#fff" }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Welcome to Library Management System</h2>
          </div>
          <Space>
            <span>Welcome{user?.name}</span>
            <Button
              type="link"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Space>
        </Header>
        <Content
          style={{ margin: "24px 16px", padding: 24, background: "#fff" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
