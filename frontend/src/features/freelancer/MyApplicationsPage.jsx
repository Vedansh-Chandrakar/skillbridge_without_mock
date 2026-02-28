import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PageHeader, Card, Badge, Button, EmptyState, Modal, SearchInput,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  DocumentCheckIcon, EyeIcon, XMarkIcon, ClockIcon,
  CheckCircleIcon, XCircleIcon, ChatBubbleLeftRightIcon,
  ArrowPathIcon, CurrencyDollarIcon, CalendarDaysIcon,
  BriefcaseIcon, UserCircleIcon, DocumentTextIcon,
  SparklesIcon, ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

const APPLICATIONS = [];

const statusColor = { pending: 'yellow', accepted: 'green', rejected: 'red', withdrawn: 'gray' };
const statusIcon = {
  pending: ClockIcon,
  accepted: CheckCircleIcon,
  rejected: XCircleIcon,
  withdrawn: ArrowPathIcon,
};

const STATUS_BANNERS = {
  pending: {
    bg: 'bg-amber-50 border-amber-200',
    icon: ClockIcon,
    iconColor: 'text-amber-500',
    title: 'Awaiting Recruiter Review',
    desc: 'Your application has been received. The recruiter will review proposals and reach out soon.',
  },
  accepted: {
    bg: 'bg-emerald-50 border-emerald-200',
    icon: CheckCircleIcon,
    iconColor: 'text-emerald-500',
    title: 'Application Accepted!',
    desc: 'Congratulations! The recruiter selected you. Head to chat to coordinate next steps.',
  },
  rejected: {
    bg: 'bg-red-50 border-red-200',
    icon: XCircleIcon,
    iconColor: 'text-red-400',
    title: 'Not Selected This Time',
    desc: 'The recruiter went with another candidate. Your skills are great — keep applying!',
  },
  withdrawn: {
    bg: 'bg-gray-50 border-gray-200',
    icon: ArrowPathIcon,
    iconColor: 'text-gray-400',
    title: 'Application Withdrawn',
    desc: 'You withdrew this application. You can browse other gigs and apply again anytime.',
  },
};

export default function MyApplicationsPage() {
  const [apps, setApps] = useState(APPLICATIONS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [withdrawApp, setWithdrawApp] = useState(null);
  const [modalTab, setModalTab] = useState('status');

  const openModal = (app) => { setSelectedApp(app); setModalTab('status'); };

  const pending = apps.filter((a) => a.status === 'pending').length;
  const accepted = apps.filter((a) => a.status === 'accepted').length;

  const filtered = apps.filter((a) => {
    const matchSearch = a.gigTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleWithdraw = (id) => {
    setApps((prev) => prev.map((a) => a.id === id ? { ...a, status: 'withdrawn' } : a));
    setWithdrawApp(null);
  };

  return (
    <div>
      <PageHeader
        title="My Applications"
        subtitle={`${apps.length} applications • ${pending} pending • ${accepted} accepted`}
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Total', value: apps.length, cls: 'text-gray-900', bg: 'bg-gray-50', Icon: DocumentCheckIcon },
          { label: 'Pending', value: pending, cls: 'text-amber-600', bg: 'bg-amber-50', Icon: ClockIcon },
          { label: 'Accepted', value: accepted, cls: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircleIcon },
          { label: 'Rejected', value: apps.filter((a) => a.status === 'rejected').length, cls: 'text-red-600', bg: 'bg-red-50', Icon: XCircleIcon },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                <c.Icon className={`h-5 w-5 ${c.cls}`} />
              </div>
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
            <SearchInput value={search} onChange={setSearch} placeholder="Search by gig title..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={DocumentCheckIcon}
          title="No applications found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <Card padding={false}>
          <Table>
            <TableHead>
              <TableHeader>Gig</TableHeader>
              <TableHeader>Campus</TableHeader>
              <TableHeader>Budget</TableHeader>
              <TableHeader>Progress</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableHead>
            <TableBody>
              {filtered.map((app) => {
                const StatusI = statusIcon[app.status];
                return (
                  <TableRow key={app.id} className="cursor-pointer hover:bg-indigo-50/30" onClick={() => openModal(app)}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{app.gigTitle}</p>
                        <p className="text-xs text-gray-500">by {app.recruiter}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color="blue" size="sm">{app.campus}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-emerald-600">${app.proposedBudget}</TableCell>
                    <TableCell>
                      {/* Mini progress indicator */}
                      <div className="flex items-center gap-1">
                        {app.timeline.map((step, i) => (
                          <div key={i} className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${step.done
                                ? app.status === 'rejected' && i === app.timeline.length - 1 ? 'bg-red-500' : 'bg-emerald-500'
                                : 'bg-gray-200'}`}
                            />
                            {i < app.timeline.length - 1 && (
                              <div className={`w-4 h-0.5 ${step.done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                            )}
                          </div>
                        ))}
                        <span className="ml-2 text-xs text-gray-400">{app.timeline.filter((s) => s.done).length}/{app.timeline.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge color={statusColor[app.status]} dot>{app.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => openModal(app)} className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="View details">
                          <DocumentTextIcon className="h-4 w-4" />
                        </button>
                        <Link to={`/student/gigs/${app.gigId}`} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="View gig">
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        {app.status === 'pending' && (
                          <button onClick={() => setWithdrawApp(app)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Withdraw">
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* ── Application Detail Modal ── */}
      <Modal open={!!selectedApp} onClose={() => setSelectedApp(null)} title="Application Details" size="lg">
        {selectedApp && (() => {
          const banner = STATUS_BANNERS[selectedApp.status];
          const BannerIcon = banner.icon;
          return (
            <div>
              {/* Header */}
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedApp.gigTitle}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <Badge color="blue" size="sm">{selectedApp.campus}</Badge>
                  <Badge color={statusColor[selectedApp.status]} dot>{selectedApp.status}</Badge>
                  <span className="text-xs text-gray-400">Applied {selectedApp.appliedAt}</span>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 mb-5">
                {[
                  { key: 'status', label: 'Status & Timeline', icon: ClockIcon },
                  { key: 'application', label: 'My Application', icon: DocumentTextIcon },
                ].map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setModalTab(key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                      modalTab === key
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* ── STATUS TAB ── */}
              {modalTab === 'status' && (
                <div className="space-y-5">
                  {/* Status Banner */}
                  <div className={`rounded-xl border p-4 flex items-start gap-3 ${banner.bg}`}>
                    <BannerIcon className={`h-6 w-6 shrink-0 mt-0.5 ${banner.iconColor}`} />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{banner.title}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{banner.desc}</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <CurrencyDollarIcon className="h-5 w-5 mx-auto text-emerald-500 mb-1" />
                      <p className="text-base font-bold text-gray-900">${selectedApp.proposedBudget}</p>
                      <p className="text-xs text-gray-500">Your Bid</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <CalendarDaysIcon className="h-5 w-5 mx-auto text-indigo-500 mb-1" />
                      <p className="text-base font-bold text-gray-900">{selectedApp.proposal.proposedTimeline}</p>
                      <p className="text-xs text-gray-500">Timeline</p>
                    </div>
                    <div className="rounded-xl bg-gray-50 p-3 text-center">
                      <UserCircleIcon className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                      <p className="text-base font-bold text-gray-900 truncate">{selectedApp.recruiter}</p>
                      <p className="text-xs text-gray-500">Recruiter</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">Application Timeline</h4>
                    <div className="relative">
                      {selectedApp.timeline.map((step, i) => {
                        const isLast = i === selectedApp.timeline.length - 1;
                        const isRejected = selectedApp.status === 'rejected' && isLast;
                        const isWithdrawn = selectedApp.status === 'withdrawn' && isLast;
                        const isCurrent = !step.done && i === selectedApp.timeline.findIndex((s) => !s.done);
                        const dotColor = step.done
                          ? isRejected || isWithdrawn ? 'bg-red-100 text-red-500' : 'bg-emerald-100 text-emerald-600'
                          : isCurrent ? 'bg-indigo-100 text-indigo-500 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-400';
                        const lineColor = step.done
                          ? isRejected || isWithdrawn ? 'bg-red-200' : 'bg-emerald-200'
                          : 'bg-gray-100';
                        return (
                          <div key={i} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${dotColor}`}>
                                {step.done ? (
                                  isRejected || isWithdrawn
                                    ? <XCircleIcon className="h-4 w-4" />
                                    : <CheckCircleIcon className="h-4 w-4" />
                                ) : isCurrent ? (
                                  <SparklesIcon className="h-4 w-4" />
                                ) : (
                                  <ClockIcon className="h-4 w-4" />
                                )}
                              </div>
                              {!isLast && <div className={`w-0.5 h-10 ${lineColor}`} />}
                            </div>
                            <div className="pb-4 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className={`text-sm font-medium ${step.done ? 'text-gray-900' : isCurrent ? 'text-indigo-600' : 'text-gray-400'}`}>{step.stage}</p>
                                {isCurrent && <span className="text-[10px] font-semibold bg-indigo-100 text-indigo-600 rounded px-1.5 py-0.5">Current</span>}
                                {step.date && <span className="text-xs text-gray-400">{step.date}</span>}
                              </div>
                              {step.note && <p className="text-xs text-gray-500 mt-0.5">{step.note}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── APPLICATION TAB ── */}
              {modalTab === 'application' && (
                <div className="space-y-5">
                  {/* Cover Letter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <DocumentTextIcon className="h-4 w-4 text-indigo-500" /> Cover Letter / Proposal
                    </h4>
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedApp.proposal.coverLetter}</p>
                    </div>
                  </div>

                  {/* Bid Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><CurrencyDollarIcon className="h-3.5 w-3.5" /> Proposed Budget</p>
                      <p className="text-xl font-bold text-emerald-600">${selectedApp.proposedBudget}</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 p-4">
                      <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><CalendarDaysIcon className="h-3.5 w-3.5" /> Proposed Timeline</p>
                      <p className="text-xl font-bold text-gray-900">{selectedApp.proposal.proposedTimeline}</p>
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="rounded-xl border border-gray-100 p-4">
                    <p className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1"><BriefcaseIcon className="h-3.5 w-3.5" /> Availability Stated</p>
                    <p className="text-sm font-semibold text-gray-800">{selectedApp.proposal.availability}</p>
                  </div>

                  {/* Skills Highlighted */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Skills Highlighted</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.proposal.relevantSkills.map((skill) => (
                        <span key={skill} className="rounded-xl bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200">{skill}</span>
                      ))}
                    </div>
                  </div>

                  {/* Attached Files */}
                  {selectedApp.proposal.attachedSamples.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-2">Attached Samples / Files</p>
                      <div className="space-y-2">
                        {selectedApp.proposal.attachedSamples.map((file) => {
                          const ext = file.split('.').pop();
                          const colors = { pdf: 'bg-red-50 text-red-600', txt: 'bg-blue-50 text-blue-600', ipynb: 'bg-orange-50 text-orange-600', fig: 'bg-pink-50 text-pink-600' };
                          return (
                            <div key={file} className="flex items-center gap-3 rounded-lg border border-gray-100 p-2.5">
                              <div className={`w-8 h-8 rounded-lg ${colors[ext] || 'bg-gray-50 text-gray-500'} flex items-center justify-center shrink-0`}>
                                <span className="text-[10px] font-bold uppercase">{ext}</span>
                              </div>
                              <span className="text-sm text-gray-700 flex-1">{file}</span>
                              <EyeIcon className="h-4 w-4 text-gray-400" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex gap-3 pt-4 mt-4 border-t border-gray-100">
                <Link to={`/student/gigs/${selectedApp.gigId}`} className="flex-1">
                  <Button variant="secondary" className="w-full">
                    <EyeIcon className="h-4 w-4 mr-2" /> View Gig
                  </Button>
                </Link>
                {selectedApp.status === 'accepted' && (
                  <Link to="/student/chat" className="flex-1">
                    <Button variant="gradient" className="w-full">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" /> Message Recruiter
                    </Button>
                  </Link>
                )}
                {selectedApp.status === 'pending' && (
                  <Button variant="danger" className="flex-1" onClick={() => { setSelectedApp(null); setWithdrawApp(selectedApp); }}>
                    <XMarkIcon className="h-4 w-4 mr-2" /> Withdraw
                  </Button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      {/* Withdraw Confirmation */}
      <Modal open={!!withdrawApp} onClose={() => setWithdrawApp(null)} title="Withdraw Application" size="sm">
        {withdrawApp && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Are you sure you want to withdraw your application for <strong>{withdrawApp.gigTitle}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={() => handleWithdraw(withdrawApp.id)}>Yes, Withdraw</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setWithdrawApp(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
