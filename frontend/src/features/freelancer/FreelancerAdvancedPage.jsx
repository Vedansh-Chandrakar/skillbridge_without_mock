import { useState } from 'react';
import { PageHeader, Card, CardHeader, Badge, Button, Avatar, EmptyState } from '@/components/shared';
import {
  SparklesIcon,
  StarIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  HandThumbUpIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

/* ── AI Recommendation Data ───────────────── */
const AI_GIG_RECOMMENDATIONS = [];
const AI_SKILL_SUGGESTIONS = [];

/* ── Reviews Data ─────────────────────────── */
const REVIEWS = [];

/* ── Badges & Reputation Data ─────────────── */
const EARNED_BADGES = [];
const LOCKED_BADGES = [];
const REPUTATION_SCORE = null;

export default function FreelancerAdvancedPage() {
  const [activeTab, setActiveTab] = useState('ai');
  const [hoveredBadge, setHoveredBadge] = useState(null);
  const hasReputation = Boolean(REPUTATION_SCORE);

  return (
    <div>
      <PageHeader
        title="AI & Reputation"
        subtitle="AI-powered gig recommendations, reviews, and your reputation system"
      />

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1 mb-6">
        {[
          { key: 'ai',         label: 'AI Recommendations', icon: SparklesIcon    },
          { key: 'reviews',    label: 'Ratings & Reviews',  icon: StarIcon        },
          { key: 'reputation', label: 'Reputation & Badges',icon: ShieldCheckIcon },
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

      {/* ── AI Recommendations Tab ────────────── */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <SparklesIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">AI-Recommended Gigs</h3>
                <p className="text-xs text-gray-500">Matched based on your skills, history, and preferences</p>
              </div>
            </div>

            <div className="space-y-3">
              {AI_GIG_RECOMMENDATIONS.length === 0 ? (
                <EmptyState
                  title="No AI recommendations"
                  description="Recommendations will appear once your profile has enough data."
                />
              ) : (
                AI_GIG_RECOMMENDATIONS.map((gig) => (
                  <Card key={gig.id} className="hover:ring-2 hover:ring-indigo-200 transition-all relative overflow-hidden">
                    {gig.urgent && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-gradient-to-l from-red-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">URGENT</div>
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="relative h-14 w-14 shrink-0">
                        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3" stroke="#f3f4f6" />
                          <circle cx="18" cy="18" r="14" fill="none" strokeWidth="3"
                            stroke={gig.match >= 90 ? '#22c55e' : gig.match >= 80 ? '#6366f1' : '#eab308'}
                            strokeDasharray={`${gig.match} 100`} strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-900">{gig.match}%</span>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900">{gig.title}</h4>
                          <Badge color="indigo" size="sm">{gig.campus}</Badge>
                        </div>
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <LightBulbIcon className="h-3.5 w-3.5 text-amber-500" />
                          {gig.reason}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {gig.skills.map((s) => (
                            <span key={s} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{s}</span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-emerald-600">${gig.budget}</p>
                        <Button variant="gradient" size="sm" className="mt-2">Apply</Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          <Card>
            <div className="flex items-center gap-2 mb-4">
              <ArrowTrendingUpIcon className="h-5 w-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-gray-900">Recommended Skills to Learn</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {AI_SKILL_SUGGESTIONS.length === 0 ? (
                <EmptyState
                  title="No skill suggestions"
                  description="Skill suggestions will appear once more data is available."
                />
              ) : (
                AI_SKILL_SUGGESTIONS.map((s) => (
                  <div key={s.skill} className="rounded-xl bg-gradient-to-r from-gray-50 to-indigo-50/50 p-4 hover:from-indigo-50 hover:to-purple-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-900">{s.skill}</span>
                      <span className="text-xs font-medium text-green-600">{s.growth}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{s.reason}</p>
                    <Badge color={s.demand === 'High' ? 'green' : 'yellow'} size="sm">{s.demand} Demand</Badge>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}

      {/* ── Reviews Tab ──────────────────────── */}
      {activeTab === 'reviews' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {hasReputation ? (
            <Card>
              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-gray-900">{REPUTATION_SCORE.overall}</p>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarSolid key={i} className={`h-5 w-5 ${i < Math.floor(REPUTATION_SCORE.overall) ? 'text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-1">{REPUTATION_SCORE.totalReviews} reviews</p>
              </div>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = REPUTATION_SCORE.breakdown[star];
                  const pct = REPUTATION_SCORE.totalReviews
                    ? Math.round((count / REPUTATION_SCORE.totalReviews) * 100)
                    : 0;
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 w-3">{star}</span>
                      <StarSolid className="h-3.5 w-3.5 text-amber-400" />
                      <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-6 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="lg:col-span-3">
              <EmptyState
                title="No reviews yet"
                description="Ratings and reviews will appear here once you complete gigs."
              />
            </Card>
          )}

          <div className="lg:col-span-2 space-y-4">
            {REVIEWS.length === 0 ? (
              <EmptyState
                title="No review activity"
                description="Your review history will appear here once available."
              />
            ) : (
              REVIEWS.map((r) => (
                <Card key={r.id}>
                  <div className="flex items-start gap-3">
                    <Avatar name={r.reviewer} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{r.reviewer}</span>
                          <Badge color="gray" size="sm">{r.reviewerRole}</Badge>
                          <Badge color="indigo" size="sm">{r.campus}</Badge>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarSolid key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'text-amber-400' : 'text-gray-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-indigo-600 font-medium mb-1.5">{r.gig}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                      {r.response && (
                        <div className="mt-3 rounded-xl bg-indigo-50 p-3">
                          <p className="text-[10px] font-semibold text-indigo-500 uppercase mb-1">Your Response</p>
                          <p className="text-sm text-gray-700">{r.response}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                        <span>{r.date}</span>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-indigo-600 transition-colors">
                          <HandThumbUpIcon className="h-3.5 w-3.5" /> Helpful ({r.helpful})
                        </button>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-500 transition-colors">
                          <FlagIcon className="h-3.5 w-3.5" /> Report
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── Reputation Tab ───────────────────── */}
      {activeTab === 'reputation' && (
        <div className="space-y-6">
          {hasReputation ? (
            <Card>
              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <ShieldCheckIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Reputation Level</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{REPUTATION_SCORE.level}</p>
                  </div>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Progress to <span className="font-semibold text-gray-700">{REPUTATION_SCORE.nextLevel}</span></span>
                    <span className="text-xs font-semibold text-indigo-600">{REPUTATION_SCORE.xp} / {REPUTATION_SCORE.xpNeeded} XP</span>
                  </div>
                  <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                      style={{ width: `${(REPUTATION_SCORE.xp / REPUTATION_SCORE.xpNeeded) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">{REPUTATION_SCORE.xpNeeded - REPUTATION_SCORE.xp} XP to next level</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <EmptyState
                title="No reputation data"
                description="Reputation metrics will appear once you complete gigs."
              />
            </Card>
          )}

          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrophyIcon className="h-5 w-5 text-amber-500" />
              Earned Badges ({EARNED_BADGES.length})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {EARNED_BADGES.length === 0 ? (
                <EmptyState
                  title="No earned badges"
                  description="Badges will appear here as you complete milestones."
                />
              ) : (
                EARNED_BADGES.map((badge) => (
                  <div
                    key={badge.id}
                    onMouseEnter={() => setHoveredBadge(badge.id)}
                    onMouseLeave={() => setHoveredBadge(null)}
                    className={`relative rounded-2xl bg-white ring-1 ring-gray-200 p-5 transition-all duration-300 cursor-pointer ${
                      hoveredBadge === badge.id ? 'ring-2 ring-indigo-300 shadow-lg shadow-indigo-100 -translate-y-1' : 'hover:shadow-md'
                    }`}
                  >
                    <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${badge.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <badge.icon className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-sm font-bold text-gray-900">{badge.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{badge.description}</p>
                    <p className="text-[10px] text-gray-400 mt-2">Earned {badge.earned}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-gray-400" />
              Badges In Progress ({LOCKED_BADGES.length})
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LOCKED_BADGES.length === 0 ? (
                <EmptyState
                  title="No badges in progress"
                  description="In-progress badges will appear here once available."
                />
              ) : (
                LOCKED_BADGES.map((badge) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
