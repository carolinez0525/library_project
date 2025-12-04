import { message } from 'antd';
import type { ApiError } from '@/types';

export const handleApiError = (error: unknown): void => {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    
    // 处理HTTP状态码错误
    switch (apiError.status) {
      case 400:
        message.error('请求参数错误，请检查输入');
        break;
      case 401:
        message.error('未登录或登录已过期，请重新登录');
        // 可以在这里添加重定向到登录页面的逻辑
        break;
      case 403:
        message.error('没有权限执行此操作');
        break;
      case 404:
        message.error('请求的资源不存在');
        break;
      case 500:
        message.error('服务器内部错误，请稍后重试');
        break;
      default:
        message.error(apiError.message || '发生错误，请稍后重试');
    }
  } else {
    message.error('发生未知错误，请稍后重试');
  }
};

export const handleFormError = (error: unknown): void => {
  if (error instanceof Error) {
    message.error(error.message);
  } else {
    message.error('表单验证失败，请检查输入');
  }
};

export const handleNetworkError = (): void => {
  message.error('网络连接失败，请检查网络设置');
};

export const handleValidationError = (errors: Record<string, string[]>): void => {
  const errorMessages = Object.values(errors).flat();
  message.error(errorMessages[0] || '表单验证失败，请检查输入');
}; 