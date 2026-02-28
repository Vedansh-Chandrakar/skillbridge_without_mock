import { clsx } from 'clsx';

const sizeMap = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

const colorMap = {
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-emerald-100 text-emerald-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
};

export function Avatar({ src, name, size = 'md', color = 'indigo', className, status }) {
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-300',
    busy: 'bg-red-500',
  };

  return (
    <div className={clsx('relative inline-flex shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name ?? 'Avatar'}
          className={clsx('rounded-full object-cover ring-2 ring-white', sizeMap[size])}
        />
      ) : (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full font-semibold ring-2 ring-white',
            sizeMap[size],
            colorMap[color],
          )}
          aria-label={name}
        >
          {initials ?? '?'}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'xs' || size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5',
            statusColors[status],
          )}
        />
      )}
    </div>
  );
}
