import { useState } from 'react';
import { PageHeader, Card, CardHeader, Badge, Button, Avatar, Modal } from '@/components/shared';
import {
  FlagIcon,
  ShieldExclamationIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  NoSymbolIcon,
} from '@heroicons/react/24/outline';

/* ── Backend-driven Data (empty until wired) ─────────── */
const REPORTS = [];
const ACTION_LOGS = [];

const severityConfig = {
  high: { color: 'red', label: 'High', icon: ExclamationTriangleIcon },
  medium: { color: 'yellow', label: 'Medium', icon: ClockIcon },
  low: { color: 'blue', label: 'Low', icon: FlagIcon },
};

const statusConfig = {
  pending: { color: 'yellow', label: 'Pending' },
  investigating: { color: 'blue', label: 'Investigating' },
  resolved: { color: 'green', label: 'Resolved' },
  dismissed: { color: 'gray', label: 'Dismissed' },
};

const typeConfig = {
  gig: { color: 'indigo', label: 'Gig' },
  user: { color: 'purple', label: 'User' },
  review: { color: 'amber', label: 'Review' },
};

const actionLogIcons = {
  ban: NoSymbolIcon,
  delete: TrashIcon,
  warning: ExclamationTriangleIcon,
  resolve: CheckCircleIcon,
  restore: DocumentTextIcon,
  verify: CheckCircleIcon,
  flag: FlagIcon,
  config: ShieldExclamationIcon,
};

const actionLogColors = {
  ban: 'text-red-600 bg-red-50',
  delete: 'text-red-500 bg-red-50',
  warning: 'text-amber-600 bg-amber-50',
  resolve: 'text-green-600 bg-green-50',
  restore: 'text-blue-600 bg-blue-50',
  verify: 'text-emerald-600 bg-emerald-50',
  flag: 'text-orange-600 bg-orange-50',
  config: 'text-purple-600 bg-purple-50',
};

export default function AdminModerationPage() {
  const [reports, setReports] = useState(REPORTS);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [actionNote, setActionNote] = useState('');
  const [actionLogs, setActionLogs] = useState(ACTION_LOGS);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showWarnModal, setShowWarnModal] = useState(false);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [overrideForm, setOverrideForm] = useState({ target: '', reason: '', message: '', severity: 'medium' });
  const [overrideSuccess, setOverrideSuccess] = useState('');

  const addLog = (action, type, target) => {
    setActionLogs(prev => [{ id: `a-${Date.now()}`, admin: 'Super Admin', action, type, time: 'Just now', target }, ...prev]);
  };

  const handleBanUser = () => {
    if (!overrideForm.target.trim()) return;
    addLog(`Banned user "${overrideForm.target}"`, 'ban', overrideForm.target);
    setOverrideSuccess(`User "${overrideForm.target}" has been banned.`);
    setTimeout(() => { setShowBanModal(false); setOverrideForm({ target: '', reason: '', message: '', severity: 'medium' }); setOverrideSuccess(''); }, 1500);
  };

  const handleIssueWarning = () => {
    if (!overrideForm.target.trim()) return;
    addLog(`Warning issued to "${overrideForm.target}"`, 'warning', overrideForm.target);
    setOverrideSuccess(`Warning issued to "${overrideForm.target}".`);
    setTimeout(() => { setShowWarnModal(false); setOverrideForm({ target: '', reason: '', message: '', severity: 'medium' }); setOverrideSuccess(''); }, 1500);
  };

  const handleMessageUser = () => {
    if (!overrideForm.target.trim() || !overrideForm.message.trim()) return;
    addLog(`Message sent to "${overrideForm.target}"`, 'config', overrideForm.target);
    setOverrideSuccess(`Message sent to "${overrideForm.target}".`);
    setTimeout(() => { setShowMsgModal(false); setOverrideForm({ target: '', reason: '', message: '', severity: 'medium' }); setOverrideSuccess(''); }, 1500);
  };

  const filtered = reports.filter((r) => {
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.target.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAction = (reportId, action) => {
    setReports((prev) => prev.map((r) =>
      r.id === reportId
        ? { ...r, status: action === 'resolve' ? 'resolved' : action === 'dismiss' ? 'dismissed' : r.status }
        : r,
    ));
    setActionModal(null);
    setSelectedReport(null);
    setActionNote('');
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const highSeverity = reports.filter((r) => r.severity === 'high' && r.status !== 'resolved').length;

  return (
    <div>
      <PageHeader
        title="Moderation Center"
        subtitle="Review reports, manage violations, and maintain platform integrity"
        actions={
          <div className="flex items-center gap-3">
            {highSeverity > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
                <ExclamationTriangleIcon className="h-4 w-4" />
                {highSeverity} High Priority
              </span>
            )}
            <Badge color="yellow" size="sm">{pendingCount} Pending</Badge>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Reports Panel ─────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="all">All Types</option>
                <option value="gig">Gig</option>
                <option value="user">User</option>
                <option value="review">Review</option>
              </select>
            </div>
          </Card>

          {/* Report Cards */}
          {filtered.map((r) => {
            const sev = severityConfig[r.severity];
            const st = statusConfig[r.status];
            const tp = typeConfig[r.type];
            return (
              <Card key={r.id} className={`cursor-pointer hover:ring-2 hover:ring-indigo-200 transition-all ${r.severity === 'high' && r.status === 'pending' ? 'ring-2 ring-red-200 bg-red-50/30' : ''}`}
                onClick={() => setSelectedReport(r)}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${r.severity === 'high' ? 'bg-red-100' : r.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'}`}>
                    <sev.icon className={`h-5 w-5 ${r.severity === 'high' ? 'text-red-600' : r.severity === 'medium' ? 'text-amber-600' : 'text-blue-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{r.title}</h3>
                      <Badge color={tp.color} size="sm">{tp.label}</Badge>
                      <Badge color={sev.color} size="sm">{sev.label}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{r.reason}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <span>Reported by: <span className="font-medium text-gray-600">{r.reporter}</span> ({r.reporterCampus})</span>
                      <span>Against: <span className="font-medium text-gray-600">{r.target}</span></span>
                      <span>{r.createdAt}</span>
                    </div>
                  </div>
                  <Badge color={st.color} dot size="sm">{st.label}</Badge>
                </div>
              </Card>
            );
          })}
          {filtered.length === 0 && (
            <Card>
              <div className="text-center py-8 text-gray-400">
                <ShieldExclamationIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm font-medium">No reports found</p>
                <p className="text-xs mt-1">All clear! No reports match your filters.</p>
              </div>
            </Card>
          )}
        </div>

        {/* ── Action Logs Panel ─────────────────── */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Action Logs" subtitle="Recent moderation actions" />
            <div className="mt-4 space-y-3">
              {actionLogs.length === 0 ? (
                <p className="text-xs text-gray-400">No moderation actions yet.</p>
              ) : (
                actionLogs.map((log) => {
                  const LogIcon = actionLogIcons[log.type] || FlagIcon;
                  const logColor = actionLogColors[log.type] || 'text-gray-600 bg-gray-50';
                  return (
                    <div key={log.id} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-gray-50 transition-colors">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${logColor}`}>
                        <LogIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-700">{log.action}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">by {log.admin} &bull; {log.time}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader title="Moderation Stats" subtitle="Last 30 days" />
            <div className="mt-4 space-y-3">
              {[
                { label: 'Reports Received', value: 42, color: 'text-indigo-600' },
                { label: 'Reports Resolved', value: 38, color: 'text-green-600' },
                { label: 'Users Banned', value: 3, color: 'text-red-600' },
                { label: 'Gigs Removed', value: 7, color: 'text-amber-600' },
                { label: 'Warnings Issued', value: 12, color: 'text-orange-600' },
                { label: 'Avg Resolution Time', value: '4.2h', color: 'text-blue-600' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{s.label}</span>
                  <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader title="Admin Override" subtitle="Quick actions" />
            <div className="mt-4 space-y-2">
              <button onClick={() => { setOverrideForm({ target: '', reason: '', message: '', severity: 'medium' }); setOverrideSuccess(''); setShowBanModal(true); }} className="w-full flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
                <NoSymbolIcon className="h-4 w-4" /> Ban User
              </button>
              <button onClick={() => { setOverrideForm({ target: '', reason: '', message: '', severity: 'medium' }); setOverrideSuccess(''); setShowWarnModal(true); }} className="w-full flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-600 hover:bg-amber-100 transition-colors">
                <ExclamationTriangleIcon className="h-4 w-4" /> Issue Warning
              </button>
              <button onClick={() => { setFilterStatus('pending'); setFilterType('all'); setSearch(''); }} className="w-full flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition-colors">
                <EyeIcon className="h-4 w-4" /> Review Flagged Content
              </button>
              <button onClick={() => { setOverrideForm({ target: '', reason: '', message: '', severity: 'medium' }); setOverrideSuccess(''); setShowMsgModal(true); }} className="w-full flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-100 transition-colors">
                <ChatBubbleLeftRightIcon className="h-4 w-4" /> Message User
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ── Ban User Modal ─────────────────────── */}
      <Modal open={showBanModal} onClose={() => setShowBanModal(false)} title="Ban User" size="md">
        <div className="space-y-4">
          <div className="rounded-xl bg-red-50 p-3 flex items-center gap-2">
            <NoSymbolIcon className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">This will permanently ban the user from the platform. This action is logged.</p>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Username or Email *</label>
            <input
              type="text"
              value={overrideForm.target}
              onChange={(e) => setOverrideForm(f => ({ ...f, target: e.target.value }))}
              placeholder="e.g. john_doe or john@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Reason for Ban</label>
            <textarea
              rows={3}
              value={overrideForm.reason}
              onChange={(e) => setOverrideForm(f => ({ ...f, reason: e.target.value }))}
              placeholder="Describe the reason for banning this user..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
          {overrideSuccess && (
            <div className="rounded-xl bg-green-50 px-4 py-3 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">{overrideSuccess}</p>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button variant="danger" onClick={handleBanUser} disabled={!overrideForm.target.trim()}>
              <NoSymbolIcon className="h-4 w-4 mr-1" /> Confirm Ban
            </Button>
            <Button variant="secondary" onClick={() => setShowBanModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* ── Issue Warning Modal ───────────────── */}
      <Modal open={showWarnModal} onClose={() => setShowWarnModal(false)} title="Issue Warning" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Username or Email *</label>
            <input
              type="text"
              value={overrideForm.target}
              onChange={(e) => setOverrideForm(f => ({ ...f, target: e.target.value }))}
              placeholder="e.g. john_doe or john@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Severity</label>
            <select
              value={overrideForm.severity}
              onChange={(e) => setOverrideForm(f => ({ ...f, severity: e.target.value }))}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
            >
              <option value="low">Low — Minor violation</option>
              <option value="medium">Medium — Policy breach</option>
              <option value="high">High — Serious misconduct</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Warning Message</label>
            <textarea
              rows={3}
              value={overrideForm.message}
              onChange={(e) => setOverrideForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Describe the violation and expected behaviour..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-100"
            />
          </div>
          {overrideSuccess && (
            <div className="rounded-xl bg-green-50 px-4 py-3 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">{overrideSuccess}</p>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button variant="primary" onClick={handleIssueWarning} disabled={!overrideForm.target.trim()} className="bg-amber-600 hover:bg-amber-700 shadow-amber-200">
              <ExclamationTriangleIcon className="h-4 w-4 mr-1" /> Issue Warning
            </Button>
            <Button variant="secondary" onClick={() => setShowWarnModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* ── Message User Modal ────────────────── */}
      <Modal open={showMsgModal} onClose={() => setShowMsgModal(false)} title="Message User" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Username or Email *</label>
            <input
              type="text"
              value={overrideForm.target}
              onChange={(e) => setOverrideForm(f => ({ ...f, target: e.target.value }))}
              placeholder="e.g. john_doe or john@example.com"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Message *</label>
            <textarea
              rows={4}
              value={overrideForm.message}
              onChange={(e) => setOverrideForm(f => ({ ...f, message: e.target.value }))}
              placeholder="Write your message to the user..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
            />
          </div>
          {overrideSuccess && (
            <div className="rounded-xl bg-green-50 px-4 py-3 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 font-medium">{overrideSuccess}</p>
            </div>
          )}
          <div className="flex gap-2 pt-1">
            <Button variant="primary" onClick={handleMessageUser} disabled={!overrideForm.target.trim() || !overrideForm.message.trim()}>
              <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" /> Send Message
            </Button>
            <Button variant="secondary" onClick={() => setShowMsgModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* ── Report Detail Modal ────────────────── */}
      <Modal open={!!selectedReport} onClose={() => setSelectedReport(null)} title="Report Details" size="lg">
        {selectedReport && (() => {
          const sev = severityConfig[selectedReport.severity];
          const st = statusConfig[selectedReport.status];
          return (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge color={typeConfig[selectedReport.type].color}>{typeConfig[selectedReport.type].label} Report</Badge>
                <Badge color={sev.color}>{sev.label} Severity</Badge>
                <Badge color={st.color} dot>{st.label}</Badge>
              </div>

              <div>
                <h3 className="text-base font-semibold text-gray-900">{selectedReport.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{selectedReport.reason}</p>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Details</p>
                <p className="text-sm text-gray-700">{selectedReport.details}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-blue-50 p-3">
                  <p className="text-[10px] font-semibold text-blue-400 uppercase mb-1">Reporter</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedReport.reporter}</p>
                  <p className="text-xs text-gray-500">{selectedReport.reporterCampus}</p>
                </div>
                <div className="rounded-xl bg-red-50 p-3">
                  <p className="text-[10px] font-semibold text-red-400 uppercase mb-1">Target</p>
                  <p className="text-sm font-semibold text-gray-900">{selectedReport.target}</p>
                  <p className="text-xs text-gray-500">{selectedReport.targetCampus}</p>
                </div>
              </div>

              {/* Admin action textarea */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Admin Notes</label>
                <textarea
                  rows={3}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder="Add notes about the action taken..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {selectedReport.status !== 'resolved' && selectedReport.status !== 'dismissed' && (
                <div className="flex gap-2 pt-2">
                  <Button variant="gradient" onClick={() => handleAction(selectedReport.id, 'resolve')}>
                    <CheckCircleIcon className="h-4 w-4 mr-1" /> Resolve
                  </Button>
                  <Button variant="outline" onClick={() => handleAction(selectedReport.id, 'dismiss')}>
                    <XCircleIcon className="h-4 w-4 mr-1" /> Dismiss
                  </Button>
                  <Button variant="danger" onClick={() => handleAction(selectedReport.id, 'ban')}>
                    <NoSymbolIcon className="h-4 w-4 mr-1" /> Ban Target
                  </Button>
                </div>
              )}
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}
