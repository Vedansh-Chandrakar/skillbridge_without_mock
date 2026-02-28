import { useState } from 'react';
import {
  PageHeader, Card, Badge, Avatar, Button, Modal, SearchInput, EmptyState,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  DocumentTextIcon,
  LinkIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const APPLICANTS = [];

const statusColor = { pending: 'yellow', accepted: 'green', rejected: 'red' };
const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
];

export default function ApplicantsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewApplicant, setPreviewApplicant] = useState(null);
  const [msgApplicant, setMsgApplicant] = useState(null);
  const [msgText, setMsgText] = useState('');
  const [msgSent, setMsgSent] = useState(false);
  const [applicants, setApplicants] = useState(APPLICANTS);

  const openMsg = (a) => { setMsgApplicant(a); setMsgText(''); setMsgSent(false); };
  const sendMsg = () => { if (msgText.trim()) setMsgSent(true); };

  const pending = applicants.filter((a) => a.status === 'pending').length;

  const filtered = applicants.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.gigTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (id, newStatus) => {
    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: newStatus } : a));
    if (previewApplicant?.id === id) setPreviewApplicant((p) => ({ ...p, status: newStatus }));
  };

  return (
    <div>
      <PageHeader
        title="Applicants"
        subtitle={`${applicants.length} total applications • ${pending} awaiting review`}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: 'Pending Review', value: pending, cls: 'text-amber-600', bg: 'bg-amber-50', icon: '⏳' },
          { label: 'Accepted', value: applicants.filter((a) => a.status === 'accepted').length, cls: 'text-emerald-600', bg: 'bg-emerald-50', icon: '✓' },
          { label: 'Rejected', value: applicants.filter((a) => a.status === 'rejected').length, cls: 'text-red-600', bg: 'bg-red-50', icon: '✕' },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center text-lg`}>{c.icon}</div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name or gig..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <Table>
          <TableHead>
            <TableHeader>Applicant</TableHeader>
            <TableHeader>Gig</TableHeader>
            <TableHeader>Budget</TableHeader>
            <TableHeader>Rating</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="No applicants yet"
                    description="Applications will appear here once candidates apply."
                  />
                </TableCell>
              </TableRow>
            )}
            {filtered.map((a) => (
              <TableRow key={a.id} className="cursor-pointer hover:bg-indigo-50/30" onClick={() => setPreviewApplicant(a)}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={a.name} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-400">{a.campus} • {a.year}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-700 font-medium">{a.gigTitle}</TableCell>
                <TableCell className="font-medium text-emerald-600">${a.proposedBudget}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm text-amber-600">
                    <StarIcon className="h-3.5 w-3.5" /> {a.rating}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge color={statusColor[a.status]} dot>{a.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    {a.status === 'pending' && (
                      <>
                        <button onClick={() => handleStatusChange(a.id, 'accepted')} className="rounded-lg p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors" title="Accept">
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleStatusChange(a.id, 'rejected')} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Reject">
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => openMsg(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Message">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => setPreviewApplicant(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="View profile">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ── Message Modal ── */}
      <Modal open={!!msgApplicant} onClose={() => setMsgApplicant(null)} title="Send Message" size="sm">
        {msgApplicant && (
          <div className="space-y-4">
            {msgSent ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                  <CheckIcon className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="font-semibold text-gray-900">Message Sent!</p>
                <p className="text-sm text-gray-500">Your message was sent to <strong>{msgApplicant.name}</strong>.</p>
                <Button variant="secondary" onClick={() => setMsgApplicant(null)}>Close</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <Avatar name={msgApplicant.name} size="sm" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{msgApplicant.name}</p>
                    <p className="text-xs text-gray-400">{msgApplicant.email}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none"
                    placeholder={`Write a message to ${msgApplicant.name}...`}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1" onClick={sendMsg} disabled={!msgText.trim()}>
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" /> Send
                  </Button>
                  <Button variant="secondary" className="flex-1" onClick={() => setMsgApplicant(null)}>Cancel</Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* ── Candidate Profile Preview Modal ── */}
      <Modal open={!!previewApplicant} onClose={() => setPreviewApplicant(null)} title="Candidate Profile" size="lg">
        {previewApplicant && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <Avatar name={previewApplicant.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900">{previewApplicant.name}</h3>
                <p className="text-sm text-gray-500">{previewApplicant.email}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><AcademicCapIcon className="h-4 w-4" /> {previewApplicant.major} • {previewApplicant.year}</span>
                  <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" /> {previewApplicant.campus}</span>
                </div>
              </div>
              <Badge color={statusColor[previewApplicant.status]} size="lg">{previewApplicant.status}</Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-lg font-bold text-amber-600 flex items-center justify-center gap-1"><StarIcon className="h-5 w-5" />{previewApplicant.rating}</p>
                <p className="text-xs text-amber-700">Rating</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">{previewApplicant.completedGigs}</p>
                <p className="text-xs text-indigo-700">Completed Gigs</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">${previewApplicant.proposedBudget}</p>
                <p className="text-xs text-emerald-700">Proposed Budget</p>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {previewApplicant.skills.map((s) => (
                  <span key={s} className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">{s}</span>
                ))}
              </div>
            </div>

            {/* Application Details */}
            <div className="rounded-xl bg-gray-50 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">Application Details</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-400">Applied for:</span>
                  <p className="font-medium text-gray-900">{previewApplicant.gigTitle}</p>
                </div>
                <div>
                  <span className="text-gray-400">Timeline:</span>
                  <p className="font-medium text-gray-900">{previewApplicant.proposedTimeline}</p>
                </div>
                <div>
                  <span className="text-gray-400">Applied on:</span>
                  <p className="font-medium text-gray-900">{new Date(previewApplicant.appliedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-gray-400">Portfolio:</span>
                  {previewApplicant.portfolio ? (
                    <p className="font-medium text-indigo-600 flex items-center gap-1"><LinkIcon className="h-3.5 w-3.5" />{previewApplicant.portfolio}</p>
                  ) : (
                    <p className="text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1"><DocumentTextIcon className="h-4 w-4" /> Cover Letter</h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 rounded-xl p-4">{previewApplicant.coverLetter}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              {previewApplicant.status === 'pending' ? (
                <>
                  <Button variant="gradient" className="flex-1" onClick={() => handleStatusChange(previewApplicant.id, 'accepted')}>
                    <CheckIcon className="h-4 w-4 mr-2" /> Accept Applicant
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={() => handleStatusChange(previewApplicant.id, 'rejected')}>
                    <XMarkIcon className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </>
              ) : previewApplicant.status === 'accepted' ? (
                <div className="flex-1 rounded-xl bg-emerald-50 p-3 text-center">
                  <p className="text-sm font-medium text-emerald-700">✓ This applicant has been accepted</p>
                </div>
              ) : (
                <div className="flex-1 rounded-xl bg-red-50 p-3 text-center">
                  <p className="text-sm font-medium text-red-700">✕ This applicant was rejected</p>
                </div>
              )}
              <Button variant="secondary" onClick={() => setPreviewApplicant(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
