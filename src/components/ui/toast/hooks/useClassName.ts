import { useMemo } from 'react';

import { ToastType } from '@/store/toast-message-store';

type ClassNameHookParams = {
  className?: string;
  toastType?: ToastType;
};

const selectColor = (toastType?: ToastType) => {
  switch (toastType) {
    case 'success':
      return 'bg-green-400';
    case 'error':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
};

export const useClassName = (prams: ClassNameHookParams) => {
  const { className: clsName, toastType } = prams;

  const className = useMemo(() => {
    const baseClassName =
      'fixed top-4 left-1/2 transform -translate-x-1/2 p-4 text-left rounded-lg shadow-lg z-50 w-11/12 flex justify-between items-center';
    const typeClassName = selectColor(toastType);
    const classNames = [baseClassName, typeClassName];
    if (clsName) {
      classNames.push(clsName);
    }
    return classNames.join(' ');
  }, [toastType, clsName]);

  return { className };
};
