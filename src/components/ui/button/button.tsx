import { FC, ReactNode, ComponentProps } from 'react';

import { useClassName } from './hooks/useClassName';
import { ButtonColor, ButtonSize } from './types';

type ButtonProps = ComponentProps<'button'> & {
  color?: ButtonColor;
  size?: ButtonSize;
  startIcon?: ReactNode;
  children: ReactNode;
};

export const Button: FC<ButtonProps> = (props) => {
  const {
    color = 'default',
    size = 'md',
    startIcon,
    children,
    disabled = false,
    className: clsName,
    ...buttonProps
  } = props;

  const className = useClassName({ color, size, className: clsName, disabled });

  return (
    <button
      {...buttonProps}
      className={`w-full rounded-md border border-transparent shadow-sm font-medium text-white sm:mt-0 sm:w-auto sm:text-sm ${className.button}`}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {startIcon && <span className={className.startIcon}>{startIcon}</span>}
      {children}
    </button>
  );
};
