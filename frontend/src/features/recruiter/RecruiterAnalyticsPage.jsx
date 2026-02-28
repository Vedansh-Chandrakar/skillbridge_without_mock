import { useState } from 'react';
import { PageHeader, Card, CardHeader, Badge, StatCard, Button, EmptyState } from '@/components/shared';
import {
  BriefcaseIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  TrophyIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const STATS = [];
const SPEND_DATA = [];
const HIRING_PIPELINE = [];
const GIG_CATEGORIES = [];
const RECRUITER_METRICS = [];
const TOP_FREELANCERS = [];
const HIRING_MILESTONES = [];

export default function RecruiterAnalyticsPage() {
  const [period, setPeriod] = useState('6m');
  const maxSpend = SPEND_DATA.length ? Math.max(...SPEND_DATA.map((d) => d.amount)) : 0;
  const maxPipeline = HIRING_PIPELINE.length
    ? Math.max(...HIRING_PIPELINE.map((d) => Math.max(d.posted, d.hired, d.rejected)))
    : 0;

  return (
    <div>
      <PageHeader
        title="Recruiter Analytics"
        subtitle="Track your spend, hiring pipeline, and top freelancers"
        actions={
          <div className="flex items-center gap-3">
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
            <Button variant="secondary" onClick={() => window.print()}>
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" /> Export Report
            </Button>
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
              description="Connect the backend to populate recruiter analytics."
            />
          </Card>
        ) : (
          STATS.map((s) => <StatCard key={s.label} {...s} />)
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        {/* Spend Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Spend Overview" subtitle="Monthly budget spent" />
          {SPEND_DATA.length === 0 ? (
            <EmptyState
              title="No spend data"
              description="Spend trends will appear here once data is available."
            />
          ) : (
            <>
              <div className="mt-6 flex items-end gap-4" style={{ height: '192px' }}>
                {SPEND_DATA.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-xs font-semibold text-indigo-600">${d.amount}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-300 hover:from-indigo-600 hover:to-indigo-400 transition-all duration-300 cursor-pointer"
                      style={{ height: `${Math.max((d.amount / maxSpend) * 160, 8)}px` }}
                    />
                    <span className="text-[11px] text-gray-500 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300" />
                  <span className="text-xs text-gray-500">Monthly Spend</span>
                </div>
                <div className="text-xs text-gray-500">
                  Avg: <span className="font-semibold text-indigo-600">
                    ${Math.round(SPEND_DATA.reduce((s, d) => s + d.amount, 0) / SPEND_DATA.length)}
                  </span> / month
                </div>
              </div>
            </>
          )}
        </Card>

        {/* Recruiter Metrics */}
        <Card>
          <CardHeader title="Hiring Metrics" subtitle="Key performance indicators" />
          <div className="mt-4 space-y-4">
            {RECRUITER_METRICS.length === 0 ? (
              <EmptyState
                title="No hiring metrics"
                description="Hiring metrics will appear here once data is available."
              />
            ) : (
              RECRUITER_METRICS.map((m) => (
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
        {/* Hiring Pipeline Chart */}
        <Card className="lg:col-span-2">
          <CardHeader title="Hiring Pipeline" subtitle="Monthly gigs posted vs hired" />
          {HIRING_PIPELINE.length === 0 ? (
            <EmptyState
              title="No pipeline data"
              description="Hiring pipeline data will appear once available."
            />
          ) : (
            <>
              <div className="mt-6 flex items-end gap-3" style={{ height: '160px' }}>
                {HIRING_PIPELINE.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div className="w-full flex gap-0.5 items-end justify-center" style={{ height: '130px' }}>
                      <div className="w-3 rounded-t bg-indigo-400 transition-all" style={{ height: `${Math.max((d.posted   / maxPipeline) * 130, 4)}px` }} />
                      <div className="w-3 rounded-t bg-emerald-400 transition-all" style={{ height: `${Math.max((d.hired    / maxPipeline) * 130, 4)}px` }} />
                      <div className="w-3 rounded-t bg-red-300 transition-all"    style={{ height: `${Math.max((d.rejected / maxPipeline) * 130, 4)}px` }} />
                    </div>
                    <span className="text-[10px] text-gray-500 font-medium">{d.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-5 pt-4 border-t border-gray-100">
                {[
                  { label: 'Posted',   color: 'bg-indigo-400' },
                  { label: 'Hired',    color: 'bg-emerald-400' },
                  { label: 'Rejected', color: 'bg-red-300' },
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

        {/* Gig Category Breakdown */}
        <Card>
          <CardHeader title="Spend by Category" subtitle="Where your budget went" />
          <div className="mt-4 space-y-3">
            {GIG_CATEGORIES.length === 0 ? (
              <EmptyState
                title="No spend categories"
                description="Spend breakdown will appear once data is available."
              />
            ) : (
              GIG_CATEGORIES.map((c) => {
                const totalSpend = SPEND_DATA.reduce((s, d) => s + d.amount, 0);
                const pct = totalSpend ? Math.round((c.spent / totalSpend) * 100) : 0;
                return (
                  <div key={c.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">{c.category}</span>
                      <span className="text-xs text-gray-500">${c.spent} • {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-400 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Freelancers */}
        <Card>
          <CardHeader title="Top Freelancers" subtitle="Your highest-performing hires" />
          <div className="mt-4 space-y-3">
            {TOP_FREELANCERS.length === 0 ? (
              <EmptyState
                title="No top freelancers"
                description="Top freelancers will appear once data is available."
              />
            ) : (
              TOP_FREELANCERS.map((f, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 shrink-0">
                    {f.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{f.name}</p>
                      {f.badge && <Badge color="indigo" size="sm">{f.badge}</Badge>}
                    </div>
                    <p className="text-xs text-gray-400">{f.campus} • {f.gigs} gigs • ${f.totalPaid} paid</p>
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-amber-500 shrink-0">
                    <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{f.rating}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Hiring Milestones */}
        <Card>
          <CardHeader title="Hiring Milestones" subtitle="Your recruiter achievement timeline" />
          <div className="mt-4 space-y-3">
            {HIRING_MILESTONES.length === 0 ? (
              <EmptyState
                title="No milestones yet"
                description="Hiring milestones will appear once data is available."
              />
            ) : (
              HIRING_MILESTONES.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${m.achieved ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    {m.achieved
                      ? <CheckCircleIcon className="h-4 w-4 text-indigo-600" />
                      : <ClockIcon       className="h-4 w-4 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${m.achieved ? 'text-gray-900' : 'text-gray-400'}`}>{m.title}</p>
                    <p className="text-xs text-gray-400">{m.date}</p>
                  </div>
                  {m.achieved && <Badge color="indigo" size="sm">Done</Badge>}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
