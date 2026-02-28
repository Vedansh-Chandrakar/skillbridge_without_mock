import { PageHeader, StatCard, Card, CardHeader, Badge, Avatar, EmptyState } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import {
  BuildingLibraryIcon,
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const stats = [];

const recentActivity = [];

const topCampuses = [];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform-wide overview across all campuses"
      />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.length === 0 ? (
          <Card className="sm:col-span-2 xl:col-span-3">
            <EmptyState
              icon={ChartBarIcon}
              title="No analytics yet"
              description="Connect the backend to load platform metrics."
            />
          </Card>
        ) : (
          stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardHeader title="Recent Activity" subtitle="Latest platform events" />
          <div className="mt-4 space-y-3">
            {recentActivity.length === 0 ? (
              <EmptyState
                icon={UsersIcon}
                title="No recent activity"
                description="Activity will appear here once events are available."
              />
            ) : (
              recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50">
                  <Avatar name={item.user} size="sm" color={item.type === 'campus' ? 'blue' : item.type === 'gig' ? 'green' : 'purple'} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{item.user}</span>{' '}
                      <span className="text-gray-500">{item.action}</span>
                    </p>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top campuses */}
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <CardHeader title="Top Campuses" subtitle="By student count" />
            <button
              onClick={() => navigate('/admin/campuses')}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors flex-shrink-0 mt-0.5"
            >
              View all
              <ArrowRightIcon className="h-3 w-3" />
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {topCampuses.length === 0 ? (
              <EmptyState
                icon={BuildingLibraryIcon}
                title="No campus data"
                description="Campus stats will show after backend integration."
              />
            ) : (
              topCampuses.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.students} students · {c.gigs} gigs</p>
                  </div>
                  <Badge color={c.status === 'active' ? 'green' : 'yellow'} dot size="sm">
                    {c.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
