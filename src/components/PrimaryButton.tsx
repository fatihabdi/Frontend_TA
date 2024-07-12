import * as React from 'react';
import clsxm from '../lib/clsxm';

type PrimaryButtonProps = {
  btnClassName?: string;
  children?: string | React.ReactElement;
  disabled?: boolean;
  is_loading?: boolean;
  size?: string; // normal|mini
  rounded?: boolean;
  leftIcon?: React.ReactElement; // Optional left icon
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void; // Specify the type of the event parameter
};

/**
 *
 * @description Must set width using `w-` className
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
export default function PrimaryButton({
  btnClassName,
  children,
  disabled,
  size,
  is_loading,
  rounded,
  leftIcon,
  onClick,
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || is_loading}
      onClick={!disabled && !is_loading ? onClick : undefined}
      className={clsxm(
        'cursor-pointer flex w-full items-center justify-center gap-1 bg-Primary-500 text-center font-medium text-Base-white transition-all duration-300 disabled:bg-lighter-gray disabled:text-dark/60 whitespace-nowrap',
        size && size === 'mini' ? 'py-2 px-4 text-sm' : 'py-3 px-4',
        rounded ? 'rounded-full' : 'rounded-xl',
        btnClassName,
        disabled || is_loading ? 'cursor-not-allowed' : ''
      )}
      {...rest}
    >
      {is_loading && (
        <div>
          <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
      {leftIcon && <div className="mr-2">{leftIcon}</div>}
      <div className="flex items-center justify-center">{children}</div>
    </button>
  );
}
