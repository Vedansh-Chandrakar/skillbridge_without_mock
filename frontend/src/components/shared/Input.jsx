import { clsx } from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  { label, id, error, hint, icon: Icon, className, ...rest },
  ref,
) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-4.5 w-4.5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={clsx(
            'block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm transition-all duration-200',
            'placeholder:text-gray-400',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            Icon && 'pl-10',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 hover:border-gray-300',
          )}
          {...rest}
        />
      </div>
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
