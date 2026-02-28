import { useState } from 'react';
import { clsx } from 'clsx';

export function Tabs({ tabs, defaultIndex = 0, onChange }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const handleChange = (index) => {
    setActiveIndex(index);
    onChange?.(index);
  };

  return (
    <div>
      <div className="border-b border-gray-200" role="tablist">
        <nav className="-mb-px flex gap-1" aria-label="Tabs">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              role="tab"
              aria-selected={i === activeIndex}
              onClick={() => handleChange(i)}
              className={clsx(
                'relative px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg',
                i === activeIndex
                  ? 'text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
              )}
            >
              <span className="flex items-center gap-2">
                {tab.icon && <tab.icon className="h-4 w-4" />}
                {tab.label}
                {tab.count != null && (
                  <span className={clsx(
                    'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                    i === activeIndex
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-100 text-gray-500',
                  )}>
                    {tab.count}
                  </span>
                )}
              </span>
              {i === activeIndex && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-4 animate-fade-in" role="tabpanel">
        {tabs[activeIndex]?.content}
      </div>
    </div>
  );
}
