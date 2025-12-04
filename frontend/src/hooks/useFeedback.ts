import { message, Modal } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalFuncProps } from 'antd/es/modal/interface';

let messageApi: MessageInstance;

export const useFeedback = () => {
  if (!messageApi) {
    messageApi = message;
  }

  return {
    message: messageApi,
    modal: {
      confirm: (props: ModalFuncProps) => Modal.confirm(props),
      success: (props: ModalFuncProps) => Modal.success(props),
      error: (props: ModalFuncProps) => Modal.error(props),
      warning: (props: ModalFuncProps) => Modal.warning(props),
      info: (props: ModalFuncProps) => Modal.info(props),
    },
  };
}; 