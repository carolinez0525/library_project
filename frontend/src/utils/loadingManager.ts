import { message } from 'antd';

let loadingCount = 0;

export const showLoading = (tip?: string): void => {
  loadingCount++;
  if (loadingCount === 1) {
    message.loading({ content: tip || '加载中...', key: 'loading' });
  }
};

export const hideLoading = (): void => {
  loadingCount--;
  if (loadingCount === 0) {
    message.destroy('loading');
  }
};

export const resetLoading = (): void => {
  loadingCount = 0;
  message.destroy('loading');
};

export const withLoading = async <T>(
  promise: Promise<T>,
  tip?: string
): Promise<T> => {
  try {
    showLoading(tip);
    return await promise;
  } finally {
    hideLoading();
  }
}; 