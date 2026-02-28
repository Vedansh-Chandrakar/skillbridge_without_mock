import { useState } from 'react';
import { PageHeader, Card, CardHeader, Badge, StatCard, Button } from '@/components/shared';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';

/* ── Backend-driven Data (empty until wired) ─────────── */
const STATS = [];
const MONTHLY_DATA = [];
const CAMPUS_STATS = [];
const CATEGORY_BREAKDOWN = [];
const PLATFORM_HEALTH = [];

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const maxGigs = Math.max(1, ...MONTHLY_DATA.map((d) => d.gigs));
  const avgGigs = MONTHLY_DATA.length
    ? Math.round(MONTHLY_DATA.reduce((s, d) => s + d.gigs, 0) / MONTHLY_DATA.length)
    : 0;

  return (
    <div>
      <PageHeader
        title="Platform Analytics"
        subtitle="Comprehensive insights across all campuses and users"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-gray-100 p-0.5">
              {['1m', '3m', '6m', '1y'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export Report
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {STATS.length === 0 ? (
          <Card className="sm:col-span-2 xl:col-span-4">
            <div className="py-6 text-center text-sm text-gray-500">
              Analytics will appear once backend data is connected.
            </div>
          </Card>
        ) : (
          STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Gig Volume Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Gig Volume & Growth" subtitle="Monthly gig postings across all campuses" />
          {MONTHLY_DATA.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              No monthly data yet.
            </div>
          ) : (
            <div className="mt-6 flex items-end gap-3 h-48">
              {MONTHLY_DATA.map((d) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">{d.gigs}</span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-400 transition-all duration-500 hover:from-indigo-600 hover:to-purple-500"
                    style={{ height: `${(d.gigs / maxGigs) * 100}%`, minHeight: 8 }}
                  />
                  <span className="text-[11px] text-gray-500 font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center gap-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-400" />
              <span className="text-xs text-gray-500">Gigs Posted</span>
            </div>
            <div className="text-xs text-gray-500">
              Avg: <span className="font-semibold text-gray-900">{avgGigs}</span> / month
            </div>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader title="Gig Categories" subtitle="Distribution by type" />
          <div className="mt-4 space-y-3">
            {CATEGORY_BREAKDOWN.length === 0 ? (
              <div className="text-sm text-gray-400">No category data yet.</div>
            ) : (
              CATEGORY_BREAKDOWN.map((cat) => (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                    <span className="text-xs text-gray-500">{cat.count} ({cat.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className={`h-full rounded-full ${cat.color} transition-all duration-700`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Campus Activity + Platform Health */}
      <div className="grid gap-6 lg:grid-cols-5 mb-6">
        {/* Campus Performance Table */}
        <Card padding={false} className="lg:col-span-3">
          <div className="px-5 pt-5">
            <CardHeader title="Campus Performance" subtitle="Revenue and engagement by campus" />
          </div>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Campus</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Students</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Gigs</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Growth</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CAMPUS_STATS.map((c, i) => (
                  <tr key={c.name} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">{i + 1}</span>
                        <span className="font-semibold text-gray-900">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{c.students}</td>
                    <td className="py-3 px-4 text-gray-600">{c.gigs}</td>
                    <td className="py-3 px-4 font-medium text-emerald-600">{c.revenue}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
                        <ArrowTrendingUpIcon className="h-3 w-3" />{c.growth}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge color={c.active ? 'green' : 'yellow'} dot size="sm">{c.active ? 'Active' : 'Onboarding'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {CAMPUS_STATS.length === 0 && (
              <div className="py-8 text-center text-sm text-gray-400">
                No campus performance data available.
              </div>
            )}
          </div>
        </Card>

        {/* Platform Health */}
        <Card className="lg:col-span-2">
          <CardHeader title="Platform Health" subtitle="Key performance indicators" />
          <div className="mt-4 space-y-4">
            {PLATFORM_HEALTH.length === 0 ? (
              <div className="text-sm text-gray-400">No health metrics yet.</div>
            ) : (
              PLATFORM_HEALTH.map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{m.value}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-medium ${m.good ? 'text-green-600' : 'text-red-500'}`}>
                      {m.trend === 'up' ? '\u2191' : '\u2193'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Donut visual */}
          <div className="mt-6 flex items-center justify-center">
            <div className="relative h-28 w-28">
              <svg className="h-28 w-28 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" stroke="#f3f4f6" />
                <circle cx="18" cy="18" r="15.5" fill="none" strokeWidth="3" stroke="url(#grad)" strokeDasharray="89 100" strokeLinecap="round" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-gray-900">89%</span>
                <span className="text-[10px] text-gray-500">Overall</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue / User Growth comparison */}
      <Card>
        <CardHeader title="Revenue & User Growth Trends" subtitle="Monthly comparison over selected period" />
        <div className="mt-6 overflow-x-auto">
          {MONTHLY_DATA.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              No trend data available.
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-4 min-w-[500px]">
              {MONTHLY_DATA.map((d) => (
                <div key={d.month} className="text-center">
                  <div className="mb-3 flex justify-center gap-1.5 items-end h-32">
                    <div className="w-6 rounded-t-md bg-indigo-400 transition-all" style={{ height: `${(d.users / 500) * 100}%` }} title={`${d.users} users`} />
                    <div className="w-6 rounded-t-md bg-emerald-400 transition-all" style={{ height: `${(d.revenue / 18000) * 100}%` }} title={`$${d.revenue}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-700">{d.month}</p>
                  <p className="text-[10px] text-gray-400">{d.users} users</p>
                  <p className="text-[10px] text-emerald-500 font-medium">${(d.revenue / 1000).toFixed(1)}K</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-indigo-400" />
            <span className="text-xs text-gray-500">New Users</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-emerald-400" />
            <span className="text-xs text-gray-500">Revenue</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
