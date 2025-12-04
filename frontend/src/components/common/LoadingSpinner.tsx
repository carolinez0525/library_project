import React from 'react';
import { Spin } from 'antd';

interface LoadingSpinnerProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  tip = '加载中...',
  size = 'default',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <Spin size={size} tip={tip} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default LoadingSpinner; 