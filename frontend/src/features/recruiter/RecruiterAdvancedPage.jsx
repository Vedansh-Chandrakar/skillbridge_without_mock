import { useState } from 'react';
import { PageHeader, Card, Badge, Button, Avatar, EmptyState } from '@/components/shared';
import {
  SparklesIcon,
  StarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

/* ── Top Students Data ────────────────────── */
const TOP_STUDENTS = [];

/* ── AI Hiring Intelligence ───────────────── */
const TRENDING_SKILLS = [];

const HIRING_TIPS = [];

/* ── Recruiter Reputation ─────────────────── */
const RECRUITER_REP = null;

const RECRUITER_BADGES = [];

const LOCKED_RECRUITER_BADGES = [];

const FREELANCER_REVIEWS_OF_ME = [];

export default function RecruiterAdvancedPage() {
  const [activeTab, setActiveTab] = useState('talent');
  const [search, setSearch] = useState('');
  const [hoveredBadge, setHoveredBadge] = useState(null);

  const hasReputationData = !!RECRUITER_REP
    || RECRUITER_BADGES.length > 0
    || LOCKED_RECRUITER_BADGES.length > 0
    || FREELANCER_REVIEWS_OF_ME.length > 0;

  const filteredStudents = TOP_STUDENTS.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.skills.some((sk) => sk.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <PageHeader
        title="AI & Hiring Intelligence"
        subtitle="AI-recommended talent, market insights, and your recruiter reputation"
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-6">
        {[
          { key: 'talent',     label: 'Top Talent',          icon: SparklesIcon    },
          { key: 'intel',      label: 'Hiring Intelligence',  icon: ChartBarIcon    },
          { key: 'reputation', label: 'My Reputation',        icon: ShieldCheckIcon },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Top Talent Tab ────────────────────── */}
      {activeTab === 'talent' && (
        <div className="space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">AI-Recommended Students</h3>
              <p className="text-xs text-gray-500">Ranked by match with your past gigs and requirements</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or skill..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="space-y-3">
            {filteredStudents.length === 0 ? (
              <EmptyState
                title="No talent recommendations yet"
                description="AI suggestions will appear once you post gigs and collect hiring data."
              />
            ) : (
              filteredStudents.map((s, i) => (
                <Card key={s.name} className="hover:ring-2 hover:ring-indigo-200 transition-all">
                  <div className="flex items-start gap-4">
                    {/* Match Score */}
                    <div className="relative h-14 w-14 shrink-0">
                      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3" stroke="#f3f4f6" />
                        <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3"
                          stroke={s.match >= 95 ? '#22c55e' : s.match >= 85 ? '#6366f1' : '#eab308'}
                          strokeDasharray={`${s.match} 100`} strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-900">{s.match}%</span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                        <Badge color="indigo" size="sm">
                          <AcademicCapIcon className="h-3 w-3 mr-0.5 inline" />{s.campus}
                        </Badge>
                        {s.badge && (
                          <Badge color={s.badge === 'Top 1%' ? 'amber' : s.badge === 'Hot' ? 'red' : 'green'} size="sm">{s.badge}</Badge>
                        )}
                        <Badge color={s.available ? 'green' : 'gray'} dot size="sm">{s.available ? 'Available' : 'Busy'}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <LightBulbIcon className="h-3.5 w-3.5 text-amber-500" />
                        {s.reason}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {s.skills.map((sk) => (
                          <span key={sk} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{sk}</span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right shrink-0 space-y-1.5">
                      <div className="flex items-center gap-0.5 justify-end">
                        <StarSolid className="h-3.5 w-3.5 text-amber-400" />
                        <span className="text-xs font-semibold text-gray-700">{s.rating}</span>
                        <span className="text-xs text-gray-400">({s.gigs})</span>
                      </div>
                      <Button variant="gradient" size="sm">Invite</Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Hiring Intelligence Tab ───────────── */}
      {activeTab === 'intel' && (
        <div className="space-y-6">
          {/* Trending Skills */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Trending Skills in Your Campus</h3>
              <span className="text-xs text-gray-400">— updated weekly</span>
            </div>
            {TRENDING_SKILLS.length === 0 ? (
              <EmptyState
                title="No market insights yet"
                description="Trending skills will appear once there is campus hiring data."
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TRENDING_SKILLS.map((s) => (
                  <div key={s.skill} className={`rounded-xl p-4 ${s.color}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">{s.skill}</span>
                      <span className="text-xs font-semibold">{s.growth}</span>
                    </div>
                    <p className="text-xs opacity-70 mb-2">Avg budget: <strong>{s.avgBudget}</strong></p>
                    <Badge color={s.demand === 'Very High' ? 'red' : s.demand === 'High' ? 'indigo' : 'yellow'} size="sm">{s.demand} Demand</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* AI Hiring Tips */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <LightBulbIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">AI Hiring Tips</h3>
                <p className="text-xs text-gray-500">Personalized advice to help you hire better</p>
              </div>
            </div>
            {HIRING_TIPS.length === 0 ? (
              <EmptyState
                title="No tips available"
                description="Tips will appear once your hiring activity grows."
              />
            ) : (
              <div className="space-y-3">
                {HIRING_TIPS.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                    <tip.icon className={`h-5 w-5 shrink-0 mt-0.5 ${tip.color}`} />
                    <p className="text-sm text-gray-700 leading-relaxed">{tip.tip}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Reputation Tab ───────────────────── */}
      {activeTab === 'reputation' && (
        <div className="space-y-6">
          {!hasReputationData ? (
            <EmptyState
              title="No reputation data yet"
              description="Your recruiter reputation will appear after hiring activity."
            />
          ) : (
            <>
              {/* Trust Score */}
              {RECRUITER_REP && (
                <Card>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200">
                        <ShieldCheckIcon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Recruiter Trust Level</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{RECRUITER_REP.level}</p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Progress to <span className="font-semibold text-gray-700">{RECRUITER_REP.nextLevel}</span></span>
                        <span className="text-xs font-semibold text-emerald-600">{RECRUITER_REP.xp} / {RECRUITER_REP.xpNeeded} XP</span>
                      </div>
                      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-700"
                          style={{ width: `${(RECRUITER_REP.xp / RECRUITER_REP.xpNeeded) * 100}%` }} />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">{RECRUITER_REP.xpNeeded - RECRUITER_REP.xp} XP to next level</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{RECRUITER_REP.trustScore}</p>
                      <div className="flex items-center justify-center gap-0.5 mt-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarSolid key={i} className={`h-3.5 w-3.5 ${i < Math.floor(RECRUITER_REP.trustScore) ? 'text-amber-400' : 'text-gray-200'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{RECRUITER_REP.totalReviews} reviews</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">{RECRUITER_REP.onTimePayments}</p>
                      <p className="text-xs text-gray-400 mt-1">On-time payments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-indigo-600">{RECRUITER_REP.repeatFreelancers}</p>
                      <p className="text-xs text-gray-400 mt-1">Repeat freelancers</p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Earned Badges */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrophyIcon className="h-5 w-5 text-amber-500" />
                  Earned Badges ({RECRUITER_BADGES.length})
                </h3>
                {RECRUITER_BADGES.length === 0 ? (
                  <EmptyState
                    title="No badges earned yet"
                    description="Badges will appear as you complete successful hires."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {RECRUITER_BADGES.map((badge) => (
                      <div
                        key={badge.name}
                        onMouseEnter={() => setHoveredBadge(badge.name)}
                        onMouseLeave={() => setHoveredBadge(null)}
                        className={`relative rounded-2xl bg-white ring-1 ring-gray-200 p-5 transition-all duration-300 cursor-pointer ${
                          hoveredBadge === badge.name ? 'ring-2 ring-emerald-300 shadow-lg shadow-emerald-100 -translate-y-1' : 'hover:shadow-md'
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-3 shadow-lg`}>
                          <badge.icon className="h-6 w-6 text-white" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-900">{badge.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                        <p className="text-[10px] text-gray-400 mt-2">Earned {badge.earned}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Badges In Progress */}
              <div>
                <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                  <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
                  Badges In Progress ({LOCKED_RECRUITER_BADGES.length})
                </h3>
                {LOCKED_RECRUITER_BADGES.length === 0 ? (
                  <EmptyState
                    title="No badges in progress"
                    description="Progress badges will appear as you continue hiring."
                  />
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {LOCKED_RECRUITER_BADGES.map((badge) => (
                      <div key={badge.name} className="rounded-2xl bg-gray-50 ring-1 ring-gray-200 p-5 opacity-75">
                        <div className="h-12 w-12 rounded-xl bg-gray-200 flex items-center justify-center mb-3">
                          <badge.icon className="h-6 w-6 text-gray-400" />
                        </div>
                        <h4 className="text-sm font-bold text-gray-600">{badge.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{badge.description}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] text-gray-500 font-medium">{badge.progress}/{badge.total}</span>
                            <span className="text-[10px] text-gray-400">{Math.round((badge.progress / badge.total) * 100)}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                            <div className="h-full rounded-full bg-gray-400 transition-all" style={{ width: `${(badge.progress / badge.total) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reviews from Freelancers */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <StarIcon className="h-5 w-5 text-amber-500" />
                  What Freelancers Say About You
                </h3>
                {FREELANCER_REVIEWS_OF_ME.length === 0 ? (
                  <EmptyState
                    title="No reviews yet"
                    description="Reviews will appear after freelancers complete gigs with you."
                  />
                ) : (
                  <div className="space-y-3">
                    {FREELANCER_REVIEWS_OF_ME.map((r, i) => (
                      <Card key={i}>
                        <div className="flex items-start gap-3">
                          <Avatar name={r.name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-semibold text-gray-900">{r.name}</span>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, j) => (
                                  <StarSolid key={j} className={`h-3.5 w-3.5 ${j < r.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-emerald-600 font-medium mb-1.5">{r.gig}</p>
                            <p className="text-sm text-gray-600">{r.text}</p>
                            <p className="text-xs text-gray-400 mt-2">{r.date}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
