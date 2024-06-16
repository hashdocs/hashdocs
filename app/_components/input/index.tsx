import clsx from 'clsx';
import React from 'react';

type Size = 'sm' | 'md' | 'lg';

const inputClass = {
  sm: 'w-full py-1.5 px-3 border border-gray-200 bg-white rounded text-xs disabled:bg-gray-100',
  md: 'w-full py-2 px-3.5 border border-gray-200 bg-white rounded-md text-xs13 disabled:bg-gray-100',
  lg: 'w-full py-3 px-4 border border-gray-200 bg-white rounded-md text-sm disabled:bg-gray-100',
  wrapper: { sm: 'relative', lg: 'relative', md: 'relative' },
};

type InputProps = {
  size?: Size;
  className?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  wrapperClassName?: string;
  wrapperProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'className'>;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'lg',
      className,
      prefix,
      suffix,
      wrapperClassName,
      inputProps,
      wrapperProps,
    },
    ref
  ) => {
    return (
      <div
        className={clsx(inputClass.wrapper[size], wrapperClassName)}
        {...wrapperProps}
      >
        {prefix}
        <input
          ref={ref}
          className={clsx(inputClass[size], className)}
          {...inputProps}
        />
        {suffix}
      </div>
    );
  }
);

export default Input;
