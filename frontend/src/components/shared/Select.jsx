import { clsx } from 'clsx';
import { forwardRef } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export const Select = forwardRef(function Select(
  { label, id, error, options = [], placeholder, className, ...rest },
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
        <select
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={clsx(
            'block w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm shadow-sm transition-all duration-200',
            'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 hover:border-gray-300',
          )}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
      {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
});
