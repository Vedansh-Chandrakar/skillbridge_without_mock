import { useState } from 'react';
import {
  PageHeader, Card, CardHeader, Badge, Avatar, Button, Modal, SearchInput, Textarea,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  BriefcaseIcon,
  TrashIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  FlagIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const CAMPUS_GIGS = [];

const statusColor = { open: 'green', in_progress: 'yellow', completed: 'indigo', closed: 'gray', deleted: 'red' };
const statusLabel = { open: 'Open', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed', deleted: 'Deleted' };

export default function CampusGigsMonitorPage() {
  const [gigs, setGigs] = useState(CAMPUS_GIGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteGig, setDeleteGig] = useState(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [viewGig, setViewGig] = useState(null);

  const filtered = gigs.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase()) || g.postedBy.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = () => {
    setGigs((prev) => prev.map((g) => g.id === deleteGig.id ? { ...g, status: 'deleted' } : g));
    setDeleteGig(null);
    setDeleteReason('');
  };

  const totalBudget = gigs.reduce((acc, g) => acc + g.budget, 0);
  const totalApplicants = gigs.reduce((acc, g) => acc + g.applicants, 0);

  return (
    <div>
      <PageHeader
        title="Gig Monitor"
        subtitle="Oversee all gigs posted by campus students."
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5 mb-6">
        {[
          { label: 'Total Gigs', value: gigs.length, cls: 'text-indigo-600', bg: 'bg-indigo-50', Icon: BriefcaseIcon },
          { label: 'Open', value: gigs.filter((g) => g.status === 'open').length, cls: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircleIcon },
          { label: 'In Progress', value: gigs.filter((g) => g.status === 'in_progress').length, cls: 'text-amber-600', bg: 'bg-amber-50', Icon: ClockIcon },
          { label: 'Total Applicants', value: totalApplicants, cls: 'text-blue-600', bg: 'bg-blue-50', Icon: UserGroupIcon },
          { label: 'Flagged', value: gigs.filter((g) => g.flagged).length, cls: 'text-red-600', bg: 'bg-red-50', Icon: FlagIcon },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                <c.Icon className={`h-5 w-5 ${c.cls}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className={`text-xl font-bold ${c.cls}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by gig title or student name..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-700 shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-gray-300"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="deleted">Deleted</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <Table>
          <TableHead>
            <TableHeader>Gig</TableHeader>
            <TableHeader>Posted By</TableHeader>
            <TableHeader>Category</TableHeader>
            <TableHeader>Budget</TableHeader>
            <TableHeader>Applicants</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                  No gigs yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((gig) => (
                <TableRow key={gig.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {gig.flagged && <FlagIcon className="h-4 w-4 text-red-500 shrink-0" />}
                      <div>
                        <p className="font-semibold text-gray-900">{gig.title}</p>
                        <p className="text-xs text-gray-400">Due {new Date(gig.deadline).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar name={gig.postedBy} size="xs" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{gig.postedBy}</p>
                        <p className="text-xs text-gray-400">{gig.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color="blue" size="sm">{gig.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-emerald-600">${gig.budget}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-sm font-semibold text-indigo-600">
                      <UserGroupIcon className="h-3.5 w-3.5" /> {gig.applicants}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColor[gig.status]} dot>{statusLabel[gig.status]}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewGig(gig)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="View details">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      {gig.status !== 'deleted' && (
                        <button onClick={() => setDeleteGig(gig)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete post">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ── Delete with Reason Modal ── */}
      <Modal open={!!deleteGig} onClose={() => { setDeleteGig(null); setDeleteReason(''); }} title="Delete Gig Post" size="md">
        {deleteGig && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Delete "{deleteGig.title}"</p>
                <p className="text-sm text-red-600 mt-1">This will remove the gig from the marketplace and notify the student.</p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-3">
              <p className="text-xs text-gray-500">Posted by: <span className="font-medium text-gray-700">{deleteGig.postedBy}</span></p>
              <p className="text-xs text-gray-500 mt-1">Budget: <span className="font-medium text-gray-700">${deleteGig.budget}</span> • Applicants: {deleteGig.applicants}</p>
            </div>

            <Textarea
              label="Reason for Deletion (required)"
              placeholder="Explain why this gig is being removed..."
              rows={3}
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />

            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleDelete} disabled={!deleteReason.trim()}>
                <TrashIcon className="h-4 w-4 mr-2" /> Delete Gig
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => { setDeleteGig(null); setDeleteReason(''); }}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── View Gig Detail Modal ── */}
      <Modal open={!!viewGig} onClose={() => setViewGig(null)} title="Gig Details" size="md">
        {viewGig && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{viewGig.title}</h3>
              <Badge color={statusColor[viewGig.status]}>{statusLabel[viewGig.status]}</Badge>
              {viewGig.flagged && <Badge color="red"><FlagIcon className="h-3 w-3 mr-1 inline" />Flagged</Badge>}
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-400">Posted By</p>
                <p className="text-sm font-medium text-gray-900">{viewGig.postedBy}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900">{viewGig.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Category</p>
                <p className="text-sm font-medium text-gray-900">{viewGig.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Budget</p>
                <p className="text-sm font-medium text-emerald-600">${viewGig.budget}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Applicants</p>
                <p className="text-sm font-medium text-indigo-600">{viewGig.applicants}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Deadline</p>
                <p className="text-sm font-medium text-gray-900">{new Date(viewGig.deadline).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Posted</p>
                <p className="text-sm font-medium text-gray-900">{new Date(viewGig.postedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              {viewGig.status !== 'deleted' && (
                <Button variant="danger" className="flex-1" onClick={() => { setViewGig(null); setDeleteGig(viewGig); }}>
                  <TrashIcon className="h-4 w-4 mr-2" /> Delete
                </Button>
              )}
              <Button variant="secondary" className="flex-1" onClick={() => setViewGig(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
