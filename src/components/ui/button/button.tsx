import { FC, ReactNode, ComponentProps } from 'react';

import { useClassName } from './hooks/useClassName';
import { ButtonColor, ButtonSize } from './types';

type ButtonProps = ComponentProps<'button'> & {
  color?: ButtonColor;
  size?: ButtonSize;
  startIcon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
};

export const Button: FC<ButtonProps> = (props) => {
  const {
    color = 'default',
    size = 'md',
    startIcon,
    loading = false,
    children,
    disabled = false,
    className: clsName,
    ...buttonProps
  } = props;

  const className = useClassName({ color, size, className: clsName, disabled });

  return (
    <button
      {...buttonProps}
      className={`flex w-auto min-w-[100px] items-center justify-center rounded-md border border-transparent font-medium text-white shadow-sm sm:mt-0 sm:w-auto sm:text-sm ${className.button} `}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {startIcon && <span className={className.startIcon}>{startIcon}</span>}
      {!loading ? (
        children
      ) : (
        <div
          className={`animate-spin rounded-full border-4 border-white border-t-transparent ${className.spinner}`}
        />
      )}
    </button>
  );
};
