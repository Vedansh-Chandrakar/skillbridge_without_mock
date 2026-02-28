import { useState, useEffect, useCallback } from 'react';
import { PageHeader, StatCard, Card, CardHeader, Badge, Avatar, EmptyState } from '@/components/shared';
import { useNavigate } from 'react-router-dom';
import {
  BuildingLibraryIcon,
  UsersIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ShieldExclamationIcon,
  ArrowRightIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { ADMIN_ENDPOINTS } from '@/config/api';

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('sb_token') || ''}`,
});

// Icon + color map keyed by stat key returned from backend
const STAT_META = {
  totalUsers:  { icon: UsersIcon,               color: 'blue',   trend: null },
  campuses:    { icon: BuildingLibraryIcon,      color: 'purple', trend: null },
  pending:     { icon: ShieldExclamationIcon,    color: 'yellow', trend: null },
  activeUsers: { icon: CheckBadgeIcon,           color: 'green',  trend: null },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats,          setStats]          = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topCampuses,    setTopCampuses]    = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.DASHBOARD, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load dashboard.');
      setStats(data.data.stats);
      setRecentActivity(data.data.recentActivity);
      setTopCampuses(data.data.topCampuses);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Platform-wide overview across all campuses"
      />

      {/* Stat cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1,2,3,4].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-600">{error}</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => {
            const meta = STAT_META[s.key] || { icon: ChartBarIcon, color: 'blue' };
            return (
              <StatCard
                key={s.key}
                label={s.label}
                value={s.value}
                icon={meta.icon}
                color={meta.color}
              />
            );
          })}
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Recent activity */}
        <Card className="lg:col-span-3">
          <CardHeader title="Recent Signups" subtitle="Latest user registrations" />
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}
              </div>
            ) : recentActivity.length === 0 ? (
              <EmptyState
                icon={UsersIcon}
                title="No recent activity"
                description="Activity will appear here once users register."
              />
            ) : (
              recentActivity.map((item) => (
                <div key={String(item.id)} className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50">
                  <Avatar
                    name={item.user}
                    size="sm"
                    color={item.type === 'campus' ? 'blue' : item.type === 'student' ? 'green' : 'purple'}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-semibold">{item.user}</span>{' '}
                      <span className="text-gray-500">{item.action}</span>
                    </p>
                    <p className="text-xs text-gray-400">{item.email} · {timeAgo(item.time)}</p>
                  </div>
                  <Badge
                    color={item.status === 'active' ? 'green' : item.status === 'pending' ? 'yellow' : 'red'}
                    dot
                    size="sm"
                  >
                    {item.status}
                  </Badge>
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
          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}
              </div>
            ) : topCampuses.length === 0 ? (
              <EmptyState
                icon={BuildingLibraryIcon}
                title="No campuses yet"
                description="Add campuses from the Campus Management page."
              />
            ) : (
              topCampuses.map((c, i) => (
                <div key={String(c.id)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-gray-50">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.students} students</p>
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
