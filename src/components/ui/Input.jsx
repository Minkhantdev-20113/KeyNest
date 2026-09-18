import { forwardRef } from 'react';
import { classNames } from '../../utils/helpers';

const Input = forwardRef(({ label, error, icon: Icon, className, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label-text">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={classNames(
            'input-field',
            Icon && 'pl-10',
            error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
