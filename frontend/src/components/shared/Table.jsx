import { clsx } from 'clsx';

export function Table({ children, className }) {
  return (
    <div className={clsx('overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5', className)}>
      <table className="min-w-full divide-y divide-gray-100">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }) {
  return (
    <thead className="bg-gray-50/80">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableHeader({ children, className, ...rest }) {
  return (
    <th
      className={clsx(
        'px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  );
}

export function TableBody({ children }) {
  return <tbody className="divide-y divide-gray-50">{children}</tbody>;
}

export function TableRow({ children, className, ...rest }) {
  return (
    <tr
      className={clsx('transition-colors hover:bg-gray-50/50', className)}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className, ...rest }) {
  return (
    <td className={clsx('whitespace-nowrap px-4 py-3.5 text-sm text-gray-700', className)} {...rest}>
      {children}
    </td>
  );
}
