import { RxCross2 } from 'react-icons/rx';

import { ToastIcon } from './components/toast-icon';
import { useClassName } from './hooks/useClassName';
import { useToast } from './hooks/useToast';

import { useToastMessageStore } from '@/store/toast-message-store';

export const Toast = () => {
  const { toastMessage, removeToastMessage } = useToastMessageStore();
  useToast();

  const { className: clsName } = useClassName({ toastType: toastMessage?.type });

  if (!toastMessage) return null;

  return (
    <div className={clsName}>
      <div className='flex items-center'>
        <ToastIcon toastType={toastMessage.type} />
        <p className='ml-2 text-base font-medium text-gray-900'>{toastMessage.message}</p>
      </div>
      <RxCross2 onClick={removeToastMessage} size={20} />
    </div>
  );
};
