import request from '@/utils/request';

export interface SystemSettings {
  max_borrow_days: number;
  max_borrow_books: number;
  max_reserve_books: number;
  enable_email_notification: boolean;
  enable_sms_notification: boolean;
  overdue_fine_per_day: number;
}

export const getSystemSettings = () => {
  return request.get<SystemSettings>('/settings/');
};

export const updateSystemSettings = (data: SystemSettings) => {
  return request.patch<SystemSettings>('/settings/', data);
}; 