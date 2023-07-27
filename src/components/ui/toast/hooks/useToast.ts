import { useEffect } from 'react';

import { useToastMessageStore } from '@/store/toast-message-store';

export const useToast = () => {
  const { toastMessage, removeToastMessage } = useToastMessageStore();

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      removeToastMessage();
    }, 5000);

    return () => clearTimeout(timer);
  }, [removeToastMessage, toastMessage]);
};
