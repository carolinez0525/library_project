import React from 'react';
import { Card, Form, InputNumber, Switch, Button, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSystemSettings, updateSystemSettings } from '@/api/settings';
import type { ApiError } from '@/types';

interface SystemSettings {
  max_borrow_days: number;
  max_borrow_books: number;
  max_reserve_books: number;
  enable_email_notification: boolean;
  enable_sms_notification: boolean;
  overdue_fine_per_day: number;
}

const SystemSettings: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery<SystemSettings>({
    queryKey: ['settings'],
    queryFn: getSystemSettings,
  });

  const updateSettingsMutation = useMutation<SystemSettings, ApiError, SystemSettings>({
    mutationFn: updateSystemSettings,
    onSuccess: () => {
      message.success('系统设置更新成功！');
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error) => {
      message.error(error.message || '更新失败，请重试！');
    },
  });

  const handleSubmit = (values: SystemSettings) => {
    updateSettingsMutation.mutate(values);
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!settings) {
    return <div>未找到系统设置</div>;
  }

  return (
    <div className="p-6">
      <Card title="系统设置">
        <Form
          form={form}
          layout="vertical"
          initialValues={settings}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="max_borrow_days"
            label="最大借阅天数"
            rules={[{ required: true, message: '请输入最大借阅天数' }]}
          >
            <InputNumber min={1} max={90} />
          </Form.Item>
          <Form.Item
            name="max_borrow_books"
            label="最大借阅数量"
            rules={[{ required: true, message: '请输入最大借阅数量' }]}
          >
            <InputNumber min={1} max={10} />
          </Form.Item>
          <Form.Item
            name="max_reserve_books"
            label="最大预约数量"
            rules={[{ required: true, message: '请输入最大预约数量' }]}
          >
            <InputNumber min={1} max={5} />
          </Form.Item>
          <Form.Item
            name="overdue_fine_per_day"
            label="每日逾期罚款（元）"
            rules={[{ required: true, message: '请输入每日逾期罚款' }]}
          >
            <InputNumber min={0} max={100} step={0.1} />
          </Form.Item>
          <Form.Item
            name="enable_email_notification"
            label="启用邮件通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="enable_sms_notification"
            label="启用短信通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={updateSettingsMutation.isPending}>
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SystemSettings; 