import { useState } from 'react';
import {
  PageHeader, Card, CardHeader, Avatar, EmptyState,
} from '@/components/shared';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const ACTIVITY_FEED = [];
const WEEKLY_STATS = [];
const TOP_STUDENTS = [];
const CATEGORY_BREAKDOWN = [];
const OVERVIEW_STATS = [];

export default function CampusActivityMonitorPage() {
  const [timeRange, setTimeRange] = useState('7d');

  const maxApps = WEEKLY_STATS.length
    ? Math.max(...WEEKLY_STATS.map((s) => s.apps))
    : 0;

  return (
    <div>
      <PageHeader
        title="Activity Monitor"
        subtitle="Track campus marketplace activity and trends."
        actions={
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-700 shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-gray-300"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        }
      />

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {OVERVIEW_STATS.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-4">
            <EmptyState
              icon={ChartBarIcon}
              title="No activity stats"
              description="Overview metrics will appear once activity data is available."
            />
          </Card>
        ) : (
          OVERVIEW_STATS.map((c) => (
            <Card key={c.label}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">{c.label}</p>
                  <p className={`text-2xl font-bold ${c.cls} mt-1`}>{c.value}</p>
                  <p className={`text-xs mt-1 flex items-center gap-1 ${c.change.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                    <ArrowTrendingUpIcon className="h-3 w-3" /> {c.change} vs last week
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${c.bg} flex items-center justify-center`}>
                  <c.Icon className={`h-6 w-6 ${c.cls}`} />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Weekly Activity Chart (simple bar chart) ── */}
        <Card className="lg:col-span-2">
          <CardHeader title="Weekly Activity" />
          {WEEKLY_STATS.length === 0 ? (
            <EmptyState
              title="No weekly activity"
              description="Weekly trends will appear once data is available."
            />
          ) : (
            <>
              <div className="flex items-end gap-3 h-48 mt-4">
                {WEEKLY_STATS.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-1 justify-center" style={{ height: '140px', alignItems: 'flex-end' }}>
                      <div
                        className="w-3 rounded-t-md bg-indigo-400 transition-all"
                        style={{ height: `${(d.gigs / 5) * 100}%`, minHeight: d.gigs > 0 ? '8px' : '2px' }}
                        title={`${d.gigs} gigs`}
                      />
                      <div
                        className="w-3 rounded-t-md bg-emerald-400 transition-all"
                        style={{ height: `${(d.apps / maxApps) * 100}%`, minHeight: d.apps > 0 ? '8px' : '2px' }}
                        title={`${d.apps} applications`}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-indigo-400" /> Gigs Posted</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400" /> Applications</span>
              </div>
            </>
          )}
        </Card>

        {/* ── Category Breakdown ── */}
        <Card>
          <CardHeader title="Categories" />
          <div className="space-y-3 mt-2">
            {CATEGORY_BREAKDOWN.length === 0 ? (
              <EmptyState
                title="No categories yet"
                description="Category breakdown will appear here once data is available."
              />
            ) : (
              CATEGORY_BREAKDOWN.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                    <span className="text-gray-400">{cat.count} ({cat.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color} transition-all`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* ── Top Performers ── */}
        <Card>
          <CardHeader title="Top Performers" />
          <div className="space-y-3 mt-2">
            {TOP_STUDENTS.length === 0 ? (
              <EmptyState
                title="No performers yet"
                description="Top performers will appear here once data is available."
              />
            ) : (
              TOP_STUDENTS.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-gray-100 text-gray-600' : i === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                  }`}>
                    {i + 1}
                  </span>
                  <Avatar name={s.name} size="xs" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.gigs} gigs • ⭐ {s.rating}</p>
                  </div>
                  <span className="text-sm font-semibold text-emerald-600">{s.earnings}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* ── Activity Feed ── */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity Feed" />
          <div className="mt-2 space-y-0 divide-y divide-gray-50">
            {ACTIVITY_FEED.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Activity events will appear here once data is available."
              />
            ) : (
              ACTIVITY_FEED.map((item) => (
                <div key={item.id} className="flex items-start gap-3 py-3">
                  <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center shrink-0`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{item.user}</span> {item.detail}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
