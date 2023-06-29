import { useMemo } from 'react';

import { ButtonColor, ButtonSize } from '../types';

const selectColor = (color: ButtonColor): string => {
  switch (color) {
    case 'primary':
      return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500';
    case 'success':
      return 'bg-green-600 hover:bg-green-700 focus:ring-green-500';
    case 'error':
      return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
    default:
      return 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500';
  }
};

const selectSize = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'py-1 px-2 text-sm';
    case 'md':
      return 'py-2 px-4 text-base';
    case 'lg':
      return 'py-3 px-6 text-lg';
    default:
      return 'py-2 px-4 text-base';
  }
};

const selectIconSize = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'h-4 w-4';
    case 'md':
      return 'h-5 w-5';
    case 'lg':
      return 'h-6 w-6';
    default:
      return 'h-5 w-5';
  }
};

export type ClassNameHoolProps = {
  color: ButtonColor;
  size: ButtonSize;
  disabled: boolean;
  className?: string;
};

export type ClassNameHoolValue = { button: string; startIcon: string };

export const useClassName = (props: ClassNameHoolProps): ClassNameHoolValue => {
  const { className: clsName, color, size, disabled } = props;

  const buttonClass = useMemo(() => {
    const colorClass = selectColor(color);

    const sizeClass = selectSize(size);

    const disabledClass = disabled ? 'disabled:opacity-50 disabled:cursor-not-allowed' : '';

    return `${colorClass} ${sizeClass} ${disabledClass} ${clsName}`;
  }, [clsName, color, size, disabled]);

  const startIconClass = useMemo(() => {
    const sizeClass = selectIconSize(size);
    return `${sizeClass}`;
  }, [size]);

  return { button: buttonClass, startIcon: startIconClass };
};
