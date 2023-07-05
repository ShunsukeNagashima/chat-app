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
      className={`min-w-[100px] w-auto flex justify-center items-center rounded-md border border-transparent shadow-sm font-medium text-white sm:mt-0 sm:w-auto sm:text-sm ${className.button} `}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {startIcon && <span className={className.startIcon}>{startIcon}</span>}
      {!loading ? (
        children
      ) : (
        <div
          className={`animate-spin border-4 border-white rounded-full border-t-transparent ${className.spinner}`}
        />
      )}
    </button>
  );
};
