import { clsx } from 'clsx';
import { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  { label, id, error, rows = 4, className, ...rest },
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
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        aria-invalid={!!error}
        className={clsx(
          'block w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm shadow-sm transition-all duration-200',
          'placeholder:text-gray-400 resize-none',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200 hover:border-gray-300',
        )}
        {...rest}
      />
      {error && (
        <p className="text-xs text-red-600" role="alert">{error}</p>
      )}
    </div>
  );
});
