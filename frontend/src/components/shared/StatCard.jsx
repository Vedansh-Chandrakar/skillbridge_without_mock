import { clsx } from 'clsx';

export function StatCard({ label, value, change, changeType = 'neutral', icon: Icon, iconColor = 'bg-indigo-100 text-indigo-600' }) {
  const changeColors = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-500 bg-gray-50',
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm ring-1 ring-gray-900/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up">
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 opacity-60 transition-transform group-hover:scale-110" />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
          {change && (
            <span className={clsx(
              'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold',
              changeColors[changeType],
            )}>
              {changeType === 'positive' && '↑'}
              {changeType === 'negative' && '↓'}
              {change}
            </span>
          )}
        </div>
        {Icon && (
          <div className={clsx('flex h-11 w-11 items-center justify-center rounded-xl', iconColor)}>
            <Icon className="h-5.5 w-5.5" />
          </div>
        )}
      </div>
    </div>
  );
}
