import clsx from 'clsx';
import React from 'react';

type Size = 'xs' | 'sm' | 'md' | 'lg';
type ButtonVariant = 'solid' | 'white' | 'outline' | 'link';

const buttonClass = {
  xs: 'border py-1 px-2 text-xs rounded transition',
  sm: 'border py-1.5 px-3 text-xs rounded transition',
  md: 'border py-2 px-3.5 text-sm rounded-md transition',
  lg: 'border py-3 px-4 text-sm rounded-md transition',
  variant: {
    solid:
      'bg-blue-700 border-blue-700 disabled:border-gray-200 text-white hover:bg-blue-700/80 shadow-sm disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    white:
      'bg-white border-white text-gray-800 hover:bg-gray-100 hover:border-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed',
    outline:
      'bg-white border-gray-200 text-gray-800 hover:bg-gray-100 shadow-sm disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100',
    link: 'px-0 py-0 bg-transparent border-none text-gray-500 underline hover:text-gray-800',
  },
};

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: Size;
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({
  size = 'lg',
  variant = 'solid',
  className,
  children,
  ...buttonProps
}) => {
  return (
    <button
      className={clsx(
        buttonClass.variant[variant],
        buttonClass[size],
        className
      )}
      data-testid={buttonProps?.id}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
