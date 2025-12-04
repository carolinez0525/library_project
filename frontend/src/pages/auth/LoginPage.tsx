import React from "react";
import { Form, Input, Button, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFeedback } from "@/hooks/useFeedback";
import { login } from "@/api/auth";
import { setCredentials } from "@/store/slices/authSlice";
import type { LoginParams } from "@/api/auth";
import type { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { message } = useFeedback();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginParams) => {
    const hide = message.loading("Loading...", 0);
    try {
      console.log("Login attempt with:", values);
      const response = await login(values);
      console.log("Login response:", response);

      if (response.user && response.tokens) {
        dispatch(
          setCredentials({
            user: response.user,
            token: response.tokens.access,
          })
        );
        message.success("Login Successfully");
        console.log("Navigating to home page...");
        navigate("/", { replace: true });
      } else {
        console.error("Invalid login response:", response);
        message.error("Login response is invalid");
      }
    } catch (error) {
      console.error("Login error:", error);
      const axiosError = error as AxiosError<ErrorResponse>;
      message.error(axiosError.response?.data?.message || "An error occurred");
    } finally {
      hide();
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card title="Login" style={{ width: 400 }}>
        <Form form={form} name="login" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>

          <div style={{ textAlign: "center" }}>
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
