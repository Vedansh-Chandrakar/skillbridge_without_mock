import { clsx } from 'clsx';

const colors = {
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  gray: 'bg-gray-50 text-gray-600 ring-gray-500/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
  cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
};

const sizes = {
  sm: 'px-2 py-0.5 text-[10px]',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-xs',
};

export function Badge({ children, color = 'indigo', size = 'md', dot = false, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full font-medium ring-1 ring-inset',
        colors[color],
        sizes[size],
        className,
      )}
    >
      {dot && (
        <svg className="h-1.5 w-1.5 fill-current" viewBox="0 0 6 6">
          <circle cx="3" cy="3" r="3" />
        </svg>
      )}
      {children}
    </span>
  );
}
