import { useState } from 'react';
import {
  PageHeader, Card, Badge, Avatar, EmptyState,
} from '@/components/shared';
import {
  XCircleIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline';

/* ── Constants ────────────────────────────────────────── */
const PIPELINE_STAGES = ['Applied', 'Reviewing', 'Shortlisted', 'Interviewing', 'Hired', 'Rejected'];

const STAGE_STYLE = {
  Applied:      { dot: 'bg-blue-500',    card: 'border-blue-100   bg-blue-50/40',      text: 'text-blue-700',    badge: 'blue',   header: 'bg-blue-50'    },
  Reviewing:    { dot: 'bg-amber-500',   card: 'border-amber-100  bg-amber-50/40',     text: 'text-amber-700',   badge: 'yellow', header: 'bg-amber-50'   },
  Shortlisted:  { dot: 'bg-purple-500',  card: 'border-purple-100 bg-white',           text: 'text-purple-700',  badge: 'purple', header: 'bg-purple-50'  },
  Interviewing: { dot: 'bg-cyan-500',    card: 'border-cyan-100   bg-cyan-50/30',      text: 'text-cyan-700',    badge: 'blue',   header: 'bg-cyan-50'    },
  Hired:        { dot: 'bg-emerald-500', card: 'border-emerald-100 bg-emerald-50/40',  text: 'text-emerald-700', badge: 'green',  header: 'bg-emerald-50' },
  Rejected:     { dot: 'bg-red-400',     card: 'border-red-100    bg-red-50/30',       text: 'text-red-600',     badge: 'red',    header: 'bg-red-50'     },
};

const CANDIDATES = [];

/* ── Kanban Card ─────────────────────────────────────── */
function KanbanCard({ candidate, onMove }) {
  const [open, setOpen] = useState(false);
  const s = STAGE_STYLE[candidate.stage];
  const idx = PIPELINE_STAGES.indexOf(candidate.stage);
  const nextStage = idx < PIPELINE_STAGES.length - 2 ? PIPELINE_STAGES[idx + 1] : null;
  const canAct = candidate.stage !== 'Hired' && candidate.stage !== 'Rejected';

  return (
    <div className={`rounded-xl border p-3 shadow-sm transition-shadow hover:shadow-md ${s.card}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <Avatar name={candidate.name} size="xs" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</p>
          <p className="text-[11px] text-gray-400">{candidate.campus}</p>
        </div>
        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-500 shrink-0">
          <StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />{candidate.rating}
        </span>
      </div>

      {/* Gig */}
      <p className="text-[11px] text-gray-500 truncate mb-2 font-medium">{candidate.gig}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {candidate.skills.map((sk) => (
          <span key={sk} className="rounded-md bg-white/80 border border-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">{sk}</span>
        ))}
      </div>

      {/* Footer */}
      {canAct ? (
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-white/60">
          <span className="text-[10px] text-gray-400">{candidate.appliedAt}</span>
          <div className="flex items-center gap-1">
            {/* Stage picker dropdown */}
            <div className="relative">
              <button
                onClick={() => setOpen((p) => !p)}
                className="flex items-center gap-0.5 rounded-md bg-white border border-gray-200 px-1.5 py-1 text-[10px] font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                title="Move to stage"
              >
                <ArrowsRightLeftIcon className="h-2.5 w-2.5" /> Move
              </button>
              {open && (
                <div className="absolute bottom-full right-0 mb-1 z-20 w-36 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden">
                  {PIPELINE_STAGES.filter((st) => st !== candidate.stage).map((st) => (
                    <button
                      key={st}
                      onClick={() => { onMove(candidate.id, st); setOpen(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-gray-50 transition-colors ${STAGE_STYLE[st].text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${STAGE_STYLE[st].dot}`} />
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Quick next button */}
            {nextStage && (
              <button
                onClick={() => onMove(candidate.id, nextStage)}
                className="flex items-center gap-0.5 rounded-md bg-indigo-600 px-1.5 py-1 text-[10px] font-medium text-white hover:bg-indigo-700 transition-colors"
                title={`Move to ${nextStage}`}
              >
                Next <ChevronRightIcon className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className={`flex items-center gap-1.5 pt-2 border-t border-white/60 text-[11px] font-semibold ${s.text}`}>
          {candidate.stage === 'Hired'
            ? <><CheckCircleIcon className="h-3.5 w-3.5" /> Hired</>
            : <><XCircleIcon className="h-3.5 w-3.5" /> Rejected</>}
          <span className="ml-auto text-[10px] text-gray-400 font-normal">{candidate.appliedAt}</span>
        </div>
      )}
    </div>
  );
}

/* ── Main Page ───────────────────────────────────────── */
export default function RecruitmentStatusPage() {
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [gigFilter, setGigFilter] = useState('all');
  const [viewMode, setViewMode] = useState('pipeline');

  const gigs = [...new Set(candidates.map((c) => c.gig))];
  const filtered = gigFilter === 'all' ? candidates : candidates.filter((c) => c.gig === gigFilter);

  const moveCandidate = (id, newStage) =>
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, stage: newStage } : c));

  return (
    <div>
      <PageHeader
        title="Recruitment Pipeline"
        subtitle="Track candidates through your hiring stages."
        actions={
          <div className="flex items-center gap-3">
            {/* Gig filter — native select, avoids shared Select bug */}
            <select
              value={gigFilter}
              onChange={(e) => setGigFilter(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="all">All Gigs</option>
              {gigs.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>

            {/* View mode toggle */}
            <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden">
              {['pipeline', 'list'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 text-xs font-semibold capitalize transition-colors ${
                    viewMode === mode ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >{mode}</button>
              ))}
            </div>
          </div>
        }
      />

      {/* Stage summary strip */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
        {PIPELINE_STAGES.map((stage) => {
          const count = filtered.filter((c) => c.stage === stage).length;
          const s = STAGE_STYLE[stage];
          return (
            <div key={stage} className={`rounded-xl border border-gray-100 p-3 text-center ${s.header}`}>
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                <p className={`text-xl font-bold ${s.text}`}>{count}</p>
              </div>
              <p className={`text-[11px] font-semibold ${s.text}`}>{stage}</p>
            </div>
          );
        })}
      </div>

      {viewMode === 'pipeline' ? (
        /* ── Kanban View ── */
        filtered.length === 0 ? (
          <EmptyState
            title="No candidates yet"
            description="Candidates will appear here once applications arrive."
          />
        ) : (
          <div className="overflow-x-auto pb-4 -mx-1 px-1">
            <div className="flex gap-3" style={{ minWidth: `${PIPELINE_STAGES.length * 220}px` }}>
              {PIPELINE_STAGES.map((stage) => {
                const cards = filtered.filter((c) => c.stage === stage);
                const s = STAGE_STYLE[stage];
                return (
                  <div key={stage} className="w-52 flex-shrink-0">
                    {/* Column header */}
                    <div className={`flex items-center gap-2 rounded-xl px-3 py-2 mb-3 ${s.header}`}>
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <h3 className={`text-xs font-bold flex-1 ${s.text}`}>{stage}</h3>
                      <span className={`rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-bold ${s.text}`}>{cards.length}</span>
                    </div>

                    {/* Cards */}
                    <div className="space-y-2.5">
                      {cards.map((c) => (
                        <KanbanCard key={c.id} candidate={c} onMove={moveCandidate} />
                      ))}
                      {cards.length === 0 && (
                        <div className="rounded-xl border-2 border-dashed border-gray-200 py-8 text-center">
                          <p className="text-xs text-gray-400">Empty</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : (
        /* ── List View ── */
        <Card padding={false}>
          <div className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <p className="py-12 text-center text-sm text-gray-400">No candidates found.</p>
            )}
            {filtered.map((c) => {
              const s = STAGE_STYLE[c.stage];
              const canAct = c.stage !== 'Hired' && c.stage !== 'Rejected';
              const idx = PIPELINE_STAGES.indexOf(c.stage);
              const nextStage = idx < PIPELINE_STAGES.length - 2 ? PIPELINE_STAGES[idx + 1] : null;

              return (
                <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/70 transition-colors">
                  <Avatar name={c.name} size="sm" />

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.campus} • {c.gig}</p>
                  </div>

                  {/* Skills */}
                  <div className="hidden md:flex flex-wrap gap-1">
                    {c.skills.map((sk) => (
                      <span key={sk} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{sk}</span>
                    ))}
                  </div>

                  {/* Rating */}
                  <span className="hidden sm:flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0">
                    <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{c.rating}
                  </span>

                  {/* Stage badge */}
                  <Badge color={s.badge} dot>{c.stage}</Badge>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {canAct && nextStage && (
                      <button
                        onClick={() => moveCandidate(c.id, nextStage)}
                        className="flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
                      >
                        {nextStage} <ChevronRightIcon className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {canAct && (
                      <button
                        onClick={() => moveCandidate(c.id, 'Rejected')}
                        className="rounded-lg p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Reject"
                      >
                        <XCircleIcon className="h-4 w-4" />
                      </button>
                    )}
                    {/* Stage dropdown */}
                    <select
                      value={c.stage}
                      onChange={(e) => moveCandidate(c.id, e.target.value)}
                      className="rounded-lg border border-gray-200 bg-gray-50 py-1.5 px-2 text-xs text-gray-600 outline-none focus:border-indigo-400 cursor-pointer"
                    >
                      {PIPELINE_STAGES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
