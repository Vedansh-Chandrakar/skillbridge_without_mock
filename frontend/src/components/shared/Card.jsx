import { clsx } from 'clsx';

export function Card({ children, className, hover = false, padding = true, ...rest }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-gray-100 bg-white shadow-sm ring-1 ring-gray-900/5',
        hover && 'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        padding && 'p-5 sm:p-6',
        'animate-fade-in',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className }) {
  return (
    <div className={clsx('flex items-start justify-between gap-4', className)}>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
