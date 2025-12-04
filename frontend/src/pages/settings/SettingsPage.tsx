import React from 'react';
import { Card, Form, Switch, Button, message } from 'antd';

interface SettingsFormValues {
  emailNotifications: boolean;
  darkMode: boolean;
}

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm<SettingsFormValues>();

  const handleSubmit = (values: SettingsFormValues) => {
    // TODO: Implement save settings logic
    console.log('Save settings:', values);
    message.success('Settings saved successfully');
  };

  return (
    <div>
      <h2>Settings</h2>
      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            emailNotifications: true,
            darkMode: false,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="emailNotifications"
            label="Email Notifications"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="darkMode"
            label="Dark Mode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage; 