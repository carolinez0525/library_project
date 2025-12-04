import React from "react";
import { Layout, Menu, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";

const { Header: AntHeader } = Layout;
const { Search } = Input;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AntHeader className="flex items-center justify-between bg-white px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-bold mr-8 text-primary">Library System</h1>
      </div>
      <div className="flex items-center">
        <span className="mr-4">Welcome, {user?.name}</span>
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="ml-4"
        >
          Logout
        </Button>
      </div>
    </AntHeader>
  );
};

export default Header;
