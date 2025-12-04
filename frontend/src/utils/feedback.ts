import { message, notification, Modal } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { NotificationInstance } from 'antd/es/notification/interface';
import type { ModalFuncProps } from 'antd/es/modal/interface';

let messageApi: MessageInstance;
let notificationApi: NotificationInstance;

// 初始化API实例
export const initFeedback = () => {
  messageApi = message;
  notificationApi = notification;
};

// 消息提示
export const showMessage = {
  success: (content: string, duration?: number) => {
    messageApi.success(content, duration);
  },
  error: (content: string, duration?: number) => {
    messageApi.error(content, duration);
  },
  warning: (content: string, duration?: number) => {
    messageApi.warning(content, duration);
  },
  info: (content: string, duration?: number) => {
    messageApi.info(content, duration);
  },
  loading: (content: string, duration?: number) => {
    return messageApi.loading(content, duration);
  },
};

// 通知提醒
export const showNotification = {
  success: (title: string, content: string, duration?: number) => {
    notificationApi.success({
      message: title,
      description: content,
      duration,
    });
  },
  error: (title: string, content: string, duration?: number) => {
    notificationApi.error({
      message: title,
      description: content,
      duration,
    });
  },
  warning: (title: string, content: string, duration?: number) => {
    notificationApi.warning({
      message: title,
      description: content,
      duration,
    });
  },
  info: (title: string, content: string, duration?: number) => {
    notificationApi.info({
      message: title,
      description: content,
      duration,
    });
  },
};

// 对话框
export const showModal = {
  confirm: (props: ModalFuncProps) => {
    return Modal.confirm(props);
  },
  success: (props: ModalFuncProps) => {
    return Modal.success(props);
  },
  error: (props: ModalFuncProps) => {
    return Modal.error(props);
  },
  warning: (props: ModalFuncProps) => {
    return Modal.warning(props);
  },
  info: (props: ModalFuncProps) => {
    return Modal.info(props);
  },
};

// 操作确认
export const confirmAction = (
  title: string,
  content: string,
  onOk: () => void | Promise<void>,
  onCancel?: () => void
) => {
  Modal.confirm({
    title,
    content,
    okText: '确认',
    cancelText: '取消',
    onOk,
    onCancel,
  });
};

// 操作成功
export const showSuccess = (content: string) => {
  showMessage.success(content);
};

// 操作失败
export const showError = (content: string) => {
  showMessage.error(content);
};

// 操作警告
export const showWarning = (content: string) => {
  showMessage.warning(content);
};

// 操作提示
export const showInfo = (content: string) => {
  showMessage.info(content);
};

// 加载中
export const showLoading = (content: string) => {
  return showMessage.loading(content);
};

// 销毁所有消息
export const destroyAll = () => {
  messageApi.destroy();
  notificationApi.destroy();
}; 