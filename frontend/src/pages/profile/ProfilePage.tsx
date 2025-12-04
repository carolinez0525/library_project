import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Modal,
  Row,
  Col,
  Typography,
  Tag,
  Timeline,
  Space,
} from "antd";
import { useAppSelector } from "@/store/hooks";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useFormValidation } from "@/hooks/useFormValidation";
import type { User } from "@/store/slices/authSlice";
import { getBorrowings } from "@/api/borrows";
import type { Borrowing } from "@/types";

interface ProfileFormValues {
  email: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const { Title, Text } = Typography;

const ProfilePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [borrowHistory, setBorrowHistory] = useState<Borrowing[]>([]);

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const history = await getBorrowings();
        setBorrowHistory(history);
      } catch (error) {
        console.error("Failed to fetch borrow history:", error);
        message.error("Failed to load borrow history");
      }
    };
    fetchBorrowHistory();
  }, []);

  const {
    form: profileForm,
    handleSubmit: handleProfileSubmit,
    isSubmitting: isProfileSubmitting,
  } = useFormValidation<ProfileFormValues>({
    onSuccess: (values) => {
      console.log("Update profile:", values);
      message.success("Profile updated successfully");
    },
    onError: (error) => {
      message.error("Update failed: " + error.message);
    },
  });

  const {
    form: passwordForm,
    handleSubmit: handlePasswordSubmit,
    resetForm: resetPasswordForm,
    isSubmitting: isPasswordSubmitting,
  } = useFormValidation<PasswordFormValues>({
    onSuccess: (values) => {
      console.log("Update password:", values);
      message.success("Password changed successfully");
      setIsPasswordModalVisible(false);
      resetPasswordForm();
    },
    onError: (error) => {
      message.error("Password change failed: " + error.message);
    },
  });

  if (!user) {
    return null;
  }

  const formatBorrowHistory = () => {
    return borrowHistory.map((borrow) => ({
      time: borrow.borrow_date,
      content: `Borrowed "${borrow.book.title}"${
        borrow.return_date ? ` (Returned on ${borrow.return_date})` : ""
      }`,
    }));
  };

  return (
    <div style={{ padding: "32px" }}>
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12} lg={8}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Title
              level={4}
              style={{
                marginBottom: "24px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "12px",
              }}
            >
              Personal Information
            </Title>
            <Form
              form={profileForm}
              layout="vertical"
              initialValues={{
                email: user.email,
              }}
              onFinish={handleProfileSubmit}
            >
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input prefix={<MailOutlined />} disabled />
              </Form.Item>
              <Form.Item>
                <Button
                  onClick={() => setIsPasswordModalVisible(true)}
                  type="primary"
                  icon={<LockOutlined />}
                >
                  Change Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Title
              level={4}
              style={{
                marginBottom: "24px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "12px",
              }}
            >
              Account Information
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div>
                <Text strong style={{ marginRight: "8px" }}>
                  Role:
                </Text>
                <Tag color={user.role === "Reader" ? "blue" : "green"}>
                  {user.role === "Reader" ? "Reader" : "Librarian"}
                </Tag>
              </div>
              <div>
                <Text strong style={{ marginRight: "8px" }}>
                  Registered:
                </Text>
                <Text>
                  {new Date(user.date_joined).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={24} lg={8}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <Title
              level={4}
              style={{
                marginBottom: "24px",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "12px",
              }}
            >
              Recent Activities
            </Title>
            <Timeline
              style={{ padding: "0 8px" }}
              items={formatBorrowHistory().map((activity) => ({
                color: "blue",
                children: (
                  <Space direction="vertical" size={4}>
                    <Text>{activity.content}</Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {activity.time}
                    </Text>
                  </Space>
                ),
              }))}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Change Password"
        open={isPasswordModalVisible}
        onCancel={() => {
          setIsPasswordModalVisible(false);
          resetPasswordForm();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordSubmit}
        >
          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { required: true, message: "Please enter your current password" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "Please confirm your new password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPasswordSubmitting}
              block
            >
              Confirm Change
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
