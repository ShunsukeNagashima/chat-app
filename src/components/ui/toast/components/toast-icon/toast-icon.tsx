import { FC } from 'react';

import { BiError, BiCheckCircle } from 'react-icons/bi';

import { ToastType } from '@/store/toast-message-store';

type ToastIconProps = {
  toastType: ToastType;
};

export const ToastIcon: FC<ToastIconProps> = (props) => {
  const { toastType } = props;

  switch (toastType) {
    case 'success':
      return <BiCheckCircle className='text-white' size={20} />;
    case 'error':
      return <BiError className='text-white' size={20} />;
    default:
      return null;
  }
};
