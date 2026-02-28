import { Badge, Button, RoleGate } from '@/components/shared';
import { useRole } from '@/hooks';
import {
  ClockIcon,
  CurrencyDollarIcon,
  TagIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

/**
 * Displays a gig card whose action buttons change based on the user's role:
 *   - Freelancers see "Apply"
 *   - Recruiters (who own the gig) see "Edit" / "Delete"
 *   - Admin / Campus see a read-only "View" button
 *
 * @param {import('@/models').Gig} props.gig
 */
export function GigCard({ gig }) {
  const { effectiveRole } = useRole();

  const statusColor = {
    open: 'green',
    in_progress: 'yellow',
    completed: 'indigo',
    cancelled: 'red',
  }[gig.status];

  return (
    <article
      className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
      aria-label={`Gig: ${gig.title}`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-gray-900 line-clamp-2">
            {gig.title}
          </h3>
          <Badge color={statusColor}>{gig.status.replace('_', ' ')}</Badge>
        </div>

        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
          {gig.description}
        </p>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <CurrencyDollarIcon className="h-4 w-4" />
            {gig.currency} {gig.budget}
          </span>
          <span className="inline-flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            {new Date(gig.deadline).toLocaleDateString()}
          </span>
        </div>

        {/* Tags */}
        {gig.tags?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {gig.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions — role-dependent */}
      <div className="mt-5 flex items-center gap-2 border-t border-gray-100 pt-4">
        {/* Freelancer: Apply */}
        <RoleGate allowed={['freelancer']}>
          <Button size="sm" className="flex-1">
            Apply Now
          </Button>
        </RoleGate>

        {/* Recruiter: Edit + Delete */}
        <RoleGate allowed={['recruiter']}>
          <Button variant="secondary" size="sm" className="flex-1" aria-label="Edit gig">
            <PencilSquareIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="danger" size="sm" aria-label="Delete gig">
            <TrashIcon className="h-4 w-4" />
          </Button>
        </RoleGate>

        {/* Admin & Campus: View only */}
        <RoleGate allowed={['admin', 'campus']}>
          <Button variant="secondary" size="sm" className="flex-1">
            View Details
          </Button>
        </RoleGate>
      </div>
    </article>
  );
}
