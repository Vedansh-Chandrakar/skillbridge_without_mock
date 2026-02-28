import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';

export function Dropdown({ trigger, items, align = 'right' }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <MenuButton as={Fragment}>
        {trigger ?? (
          <button className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
            Options
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems
          className={clsx(
            'absolute z-20 mt-2 w-48 rounded-xl bg-white p-1 shadow-lg ring-1 ring-gray-900/5 focus:outline-none',
            align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
          )}
        >
          {items.map((item) =>
            item.divider ? (
              <div key={item.key ?? 'div'} className="my-1 h-px bg-gray-100" />
            ) : (
              <MenuItem key={item.label}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={clsx(
                      'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                      active ? 'bg-gray-50 text-gray-900' : 'text-gray-700',
                      item.danger && active && 'bg-red-50 text-red-600',
                      item.danger && !active && 'text-red-600',
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.label}
                  </button>
                )}
              </MenuItem>
            ),
          )}
        </MenuItems>
      </Transition>
    </Menu>
  );
}
