import { useState } from 'react';
import { PageHeader, Card, CardHeader, StatCard, Button, Avatar, EmptyState } from '@/components/shared';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

/* ── Backend-driven Data (empty until wired) ─────────── */
const STATS = [];
const TOP_PERFORMERS = [];
const MONTHLY_PERFORMANCE = [];
const SKILL_DISTRIBUTION = [];
const RECRUITMENT_STATS = [];

export default function CampusAnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const maxVal = MONTHLY_PERFORMANCE.length
    ? Math.max(...MONTHLY_PERFORMANCE.map((d) => d.applications))
    : 0;

  return (
    <div>
      <PageHeader
        title="Campus Analytics"
        subtitle="Student performance metrics and recruitment statistics"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-gray-100 p-0.5">
              {['1m', '3m', '6m', '1y'].map((p) => (
                <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm">
              <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {STATS.length === 0 ? (
          <Card className="sm:col-span-2 xl:col-span-4">
            <EmptyState
              icon={ChartBarIcon}
              title="No analytics yet"
              description="Connect the backend to populate campus performance metrics."
            />
          </Card>
        ) : (
          STATS.map((s) => <StatCard key={s.label} {...s} />)
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Performance Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Monthly Performance" subtitle="Gigs completed, posted, and applications received" />
          {MONTHLY_PERFORMANCE.length === 0 ? (
            <EmptyState
              title="No performance data"
              description="Monthly performance will appear here once available."
            />
          ) : (
            <>
              <div className="mt-6 h-52 flex items-end gap-2">
                {MONTHLY_PERFORMANCE.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '180px' }}>
                      <div className="w-3 rounded-t bg-emerald-400 transition-all" style={{ height: `${(d.completed / maxVal) * 180}px`, minHeight: '4px' }} title={`${d.completed} completed`} />
                      <div className="w-3 rounded-t bg-indigo-400 transition-all" style={{ height: `${(d.posted / maxVal) * 180}px`, minHeight: '4px' }} title={`${d.posted} posted`} />
                      <div className="w-3 rounded-t bg-amber-400 transition-all" style={{ height: `${(d.applications / maxVal) * 180}px`, minHeight: '4px' }} title={`${d.applications} applications`} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-5 pt-4 border-t border-gray-100">
                {[{ label: 'Completed', color: 'bg-emerald-400' }, { label: 'Posted', color: 'bg-indigo-400' }, { label: 'Applications', color: 'bg-amber-400' }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded ${l.color}`} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Skill Distribution */}
        <Card>
          <CardHeader title="Skill Distribution" subtitle="Student skills breakdown" />
          <div className="mt-4 space-y-3">
            {SKILL_DISTRIBUTION.length === 0 ? (
              <EmptyState
                title="No skill data"
                description="Skill distribution will appear here once data is available."
              />
            ) : (
              SKILL_DISTRIBUTION.map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{s.skill}</span>
                    <span className="text-xs text-gray-500">{s.count} ({s.pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-700" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        {/* Top Performers */}
        <Card padding={false}>
          <div className="px-5 pt-5 pb-3">
            <CardHeader title="Top Performers" subtitle="Students ranked by completions" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">#</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Student</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Gigs</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Rating</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {TOP_PERFORMERS.length === 0 ? (
                  <tr>
                    <td className="py-8 px-4 text-center text-sm text-gray-400" colSpan={5}>
                      No performance rankings yet.
                    </td>
                  </tr>
                ) : (
                  TOP_PERFORMERS.map((p) => (
                    <tr key={p.rank} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-xs font-bold text-gray-400">{p.rank}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Avatar name={p.name} size="xs" />
                          <span className="font-semibold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{p.gigs}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-3.5 w-3.5 text-amber-400" />
                          <span className="font-medium text-gray-900">{p.rating}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-emerald-600">{p.earnings}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recruitment Stats */}
        <Card padding={false}>
          <div className="px-5 pt-5 pb-3">
            <CardHeader title="Company Recruitment" subtitle="Hiring pipeline overview" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Company</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pos.</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Apps</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Short</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Hired</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">Pipeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {RECRUITMENT_STATS.length === 0 ? (
                  <tr>
                    <td className="py-8 px-4 text-center text-sm text-gray-400" colSpan={6}>
                      No recruitment data yet.
                    </td>
                  </tr>
                ) : (
                  RECRUITMENT_STATS.map((r) => {
                    const hiringRate = r.applicants ? Math.round((r.hired / r.applicants) * 100) : 0;
                    return (
                      <tr key={r.company} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-900">{r.company}</td>
                        <td className="py-3 px-4 text-gray-600">{r.positions}</td>
                        <td className="py-3 px-4 text-gray-600">{r.applicants}</td>
                        <td className="py-3 px-4 text-indigo-600 font-medium">{r.shortlisted}</td>
                        <td className="py-3 px-4 text-emerald-600 font-medium">{r.hired}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-16 rounded-full bg-gray-100 overflow-hidden">
                              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${hiringRate}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{hiringRate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
