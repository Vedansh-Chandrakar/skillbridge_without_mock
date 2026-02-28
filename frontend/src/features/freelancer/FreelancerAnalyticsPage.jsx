import { useState } from 'react';
import { PageHeader, Card, CardHeader, Badge, StatCard, EmptyState } from '@/components/shared';
import {
  StarIcon,
  ClockIcon,
  BriefcaseIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const STATS = [];
const EARNINGS_DATA = [];
const APPLICATION_HISTORY = [];
const SKILL_RATINGS = [];
const PERFORMANCE_METRICS = [];
const RECENT_REVIEWS = [];
const MILESTONES = [];

export default function FreelancerAnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const maxEarning = EARNINGS_DATA.length ? Math.max(...EARNINGS_DATA.map((d) => d.amount)) : 0;
  const maxApp = APPLICATION_HISTORY.length ? Math.max(...APPLICATION_HISTORY.map((d) => d.applied)) : 0;

  return (
    <div>
      <PageHeader
        title="Freelancer Analytics"
        subtitle="Track your earnings, applications, and skill growth"
        actions={
          <div className="flex rounded-xl bg-gray-100 p-0.5">
            {['1m', '3m', '6m', '1y'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {STATS.length === 0 ? (
          <Card className="sm:col-span-2 xl:col-span-4">
            <EmptyState
              icon={BriefcaseIcon}
              title="No analytics yet"
              description="Connect the backend to populate your freelancer analytics."
            />
          </Card>
        ) : (
          STATS.map((s) => <StatCard key={s.label} {...s} />)
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Earnings Overview" subtitle="Monthly earnings trend" />
          {EARNINGS_DATA.length === 0 ? (
            <EmptyState
              title="No earnings data"
              description="Monthly earnings will appear here once data is available."
            />
          ) : (
            <>
              <div className="mt-6 flex items-end gap-4" style={{ height: '192px' }}>
                {EARNINGS_DATA.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-semibold text-emerald-600">${d.amount}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-300 hover:from-emerald-600 hover:to-emerald-400 transition-all duration-300 cursor-pointer"
                      style={{ height: `${Math.max((d.amount / maxEarning) * 160, 8)}px` }}
                    />
                    <span className="text-[11px] text-gray-500 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-300" />
                  <span className="text-xs text-gray-500">Monthly Earnings</span>
                </div>
                <div className="text-xs text-gray-500">
                  Avg: <span className="font-semibold text-emerald-600">
                    ${Math.round(EARNINGS_DATA.reduce((s, d) => s + d.amount, 0) / EARNINGS_DATA.length)}
                  </span> / month
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader title="Performance" subtitle="Key metrics" />
          <div className="mt-4 space-y-4">
            {PERFORMANCE_METRICS.length === 0 ? (
              <EmptyState
                title="No performance metrics"
                description="Performance metrics will appear once data is available."
              />
            ) : (
              PERFORMANCE_METRICS.map((m) => (
                <div key={m.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <m.icon className={`h-4 w-4 ${m.color}`} />
                    <span className="text-sm text-gray-600">{m.label}</span>
                  </div>
                  <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Application History */}
        <Card className="lg:col-span-2">
          <CardHeader title="Application History" subtitle="Monthly application outcomes" />
          {APPLICATION_HISTORY.length === 0 ? (
            <EmptyState
              title="No application history"
              description="Application history will appear here once data is available."
            />
          ) : (
            <>
              <div className="mt-6 flex items-end gap-3" style={{ height: '160px' }}>
                {APPLICATION_HISTORY.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '130px' }}>
                      <div className="w-2.5 rounded-t bg-indigo-400 transition-all" style={{ height: `${Math.max((d.applied  / maxApp) * 130, 4)}px` }} />
                      <div className="w-2.5 rounded-t bg-emerald-400 transition-all" style={{ height: `${Math.max((d.accepted / maxApp) * 130, 4)}px` }} />
                      <div className="w-2.5 rounded-t bg-red-300 transition-all"    style={{ height: `${Math.max((d.rejected / maxApp) * 130, 4)}px` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-5 pt-4 border-t border-gray-100">
                {[
                  { label: 'Applied',   color: 'bg-indigo-400' },
                  { label: 'Accepted',  color: 'bg-emerald-400' },
                  { label: 'Rejected',  color: 'bg-red-300' },
                ].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded ${l.color}`} />
                    <span className="text-xs text-gray-500">{l.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>

        {/* Skill Proficiency */}
        <Card>
          <CardHeader title="Skill Proficiency" subtitle="Based on completed gigs" />
          <div className="mt-4 space-y-3">
            {SKILL_RATINGS.length === 0 ? (
              <EmptyState
                title="No skill data"
                description="Skill proficiency will appear here once data is available."
              />
            ) : (
              SKILL_RATINGS.map((s) => (
                <div key={s.skill}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{s.skill}</span>
                    <span className="text-xs text-gray-500">{s.gigs} gigs • {s.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-700"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Reviews */}
        <Card>
          <CardHeader title="Recent Reviews" subtitle="Client feedback" />
          <div className="mt-4 space-y-4">
            {RECENT_REVIEWS.length === 0 ? (
              <EmptyState
                title="No reviews yet"
                description="Client reviews will appear here once you complete gigs."
              />
            ) : (
              RECENT_REVIEWS.map((r, i) => (
                <div key={i} className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{r.reviewer}</span>
                      <Badge color="indigo" size="sm">{r.gig}</Badge>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <StarIcon key={j} className={`h-3.5 w-3.5 ${j < r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{r.text}</p>
                  <p className="text-xs text-gray-400 mt-2">{r.date}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader title="Milestones" subtitle="Your achievement timeline" />
          <div className="mt-4 space-y-3">
            {MILESTONES.length === 0 ? (
              <EmptyState
                title="No milestones yet"
                description="Milestones will appear here as you complete gigs."
              />
            ) : (
              MILESTONES.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${m.achieved ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    {m.achieved
                      ? <TrophyIcon className="h-4 w-4 text-emerald-600" />
                      : <ClockIcon  className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${m.achieved ? 'text-gray-900' : 'text-gray-400'}`}>{m.title}</p>
                    <p className="text-xs text-gray-400">{m.date}</p>
                  </div>
                  {m.achieved && <Badge color="green" size="sm">Achieved</Badge>}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
