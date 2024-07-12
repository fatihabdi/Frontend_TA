import * as React from 'react';

import clsxm from '../lib/clsxm';

type TextInputProps = {
  inputClassName?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  autoComplete?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  inputClassName,
  placeholder,
  type,
  value,
  autoComplete,
  onChange,
  onBlur,
  onKeyDown,
  ...rest
}: TextInputProps) {
  return (
    <input
      type={type || 'text'}
      placeholder={placeholder || ''}
      value={value || ''}
      onChange={onChange || undefined}
      onBlur={onBlur || undefined}
      onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLInputElement> | undefined}
      autoComplete={autoComplete || 'off'}
      {...rest}
      className={clsxm('w-full rounded-lg border-Gray-200 border shadow-sm py-[10px] px-[14px] placeholder:text-Gray-500', inputClassName)}
    />
  );
}
