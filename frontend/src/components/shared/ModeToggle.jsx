import { Switch } from '@headlessui/react';
import { clsx } from 'clsx';
import { useRole } from '@/hooks';
import { STUDENT_MODES } from '@/models';

/**
 * Toggle switch that lets a student flip between Freelancer & Recruiter modes.
 */
export function ModeToggle() {
  const { activeMode, toggleMode, canToggle } = useRole();
  const isRecruiter = activeMode === STUDENT_MODES.RECRUITER;

  // Only students who registered as 'both' see the toggle
  if (!canToggle) return null;

  return (
    <div className="flex items-center gap-3">
      <span
        className={clsx(
          'text-sm font-medium',
          !isRecruiter ? 'text-indigo-600' : 'text-gray-400',
        )}
      >
        Freelancer
      </span>

      <Switch
        checked={isRecruiter}
        onChange={toggleMode}
        className={clsx(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
          isRecruiter ? 'bg-indigo-600' : 'bg-gray-200',
        )}
        aria-label="Toggle between Freelancer and Recruiter mode"
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition duration-200',
            isRecruiter ? 'translate-x-5' : 'translate-x-0',
          )}
        />
      </Switch>

      <span
        className={clsx(
          'text-sm font-medium',
          isRecruiter ? 'text-indigo-600' : 'text-gray-400',
        )}
      >
        Recruiter
      </span>
    </div>
  );
}
