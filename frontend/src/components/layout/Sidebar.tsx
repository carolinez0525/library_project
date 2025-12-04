import React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BookOutlined,
  UserOutlined,
  HistoryOutlined,
  SettingOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import type { RootState } from "@/store";

const { Sider } = Layout;

const readerMenuItems = [
  {
    key: "/reader",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "/reader/books",
    icon: <BookOutlined />,
    label: "Book Search",
  },
  {
    key: "/reader/borrows",
    icon: <HistoryOutlined />,
    label: "Borrow History",
  },
];

const adminMenuItems = [
  {
    key: "/admin",
    icon: <HomeOutlined />,
    label: "Home",
  },
  {
    key: "/admin/books",
    icon: <BookOutlined />,
    label: "Book Management",
  },
  {
    key: "/admin/users",
    icon: <UserOutlined />,
    label: "User Management",
  },
  {
    key: "/admin/settings",
    icon: <SettingOutlined />,
    label: "System Settings",
  },
];

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);

  const menuItems =
    user?.role === "Librarian" ? adminMenuItems : readerMenuItems;

  return (
    <Sider width={200} className="bg-white">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ height: "100%", borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
