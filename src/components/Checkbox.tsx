import * as React from 'react';

import clsxm from '../lib/clsxm';

type CheckboxProps = {
  checkClassName?: string;
  name?: string;
  children?: string;
  type?: string;
  checked?: boolean;
  onChange?: (event: unknown) => void;
};

export default function Checkbox({ checkClassName, name, children, type, checked, onChange, ...rest }: CheckboxProps) {
  return (
    <div className="flex items-center">
      <input
        {...rest}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange || undefined}
        className={clsxm(
          checkClassName,
          'bg-transparent',
          type === 'danger' ? 'text-danger focus:ring-danger' : 'text-primary-green focus:ring-primary-green'
        )}
      />
      {children ? (
        <label>
          {children} {type}
        </label>
      ) : (
        ''
      )}
    </div>
  );
}
