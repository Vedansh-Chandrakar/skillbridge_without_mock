import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PageHeader, Card, Badge, Button, EmptyState, Modal,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  BriefcaseIcon,
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CalendarDaysIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

const MY_GIGS = [];

const statusColor = { open: 'green', in_progress: 'yellow', completed: 'indigo', closed: 'gray' };
const statusLabel = { open: 'Open', in_progress: 'In Progress', completed: 'Completed', closed: 'Closed' };

export default function MyGigsPage() {
  const [gigs, setGigs] = useState(MY_GIGS);
  const [deleteGig, setDeleteGig] = useState(null);
  const [viewGig,   setViewGig]   = useState(null);
  const [editGig,   setEditGig]   = useState(null);
  const [editForm,  setEditForm]  = useState({});
  const [statusTab, setStatusTab] = useState('all');

  const filtered = statusTab === 'all' ? gigs : gigs.filter((g) => g.status === statusTab);

  const handleDelete = () => {
    setGigs((prev) => prev.filter((g) => g.id !== deleteGig.id));
    setDeleteGig(null);
  };

  const openEdit = (gig) => {
    setEditGig(gig);
    setEditForm({ title: gig.title, budget: gig.budget, deadline: gig.deadline, status: gig.status, category: gig.category });
  };

  const handleEditSave = () => {
    setGigs((prev) => prev.map((g) =>
      g.id === editGig.id ? { ...g, ...editForm, budget: Number(editForm.budget) } : g
    ));
    setEditGig(null);
  };

  return (
    <div>
      <PageHeader
        title="My Gigs"
        subtitle={`${gigs.length} gigs posted`}
        actions={
          <Link to="/student/post-gig">
            <Button variant="gradient">
              <PlusIcon className="h-4 w-4 mr-2" /> Post New Gig
            </Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Total Gigs', value: gigs.length, cls: 'text-gray-900', bg: 'bg-gray-50', icon: BriefcaseIcon },
          { label: 'Open', value: gigs.filter((g) => g.status === 'open').length, cls: 'text-emerald-600', bg: 'bg-emerald-50', icon: ClockIcon },
          { label: 'In Progress', value: gigs.filter((g) => g.status === 'in_progress').length, cls: 'text-amber-600', bg: 'bg-amber-50', icon: ChartBarIcon },
          { label: 'Completed', value: gigs.filter((g) => g.status === 'completed').length, cls: 'text-indigo-600', bg: 'bg-indigo-50', icon: CheckCircleIcon },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                <c.icon className={`h-5 w-5 ${c.cls}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{c.label}</p>
                <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {[
          { label: 'All', value: 'all', count: gigs.length },
          { label: 'Open', value: 'open', count: gigs.filter((g) => g.status === 'open').length },
          { label: 'In Progress', value: 'in_progress', count: gigs.filter((g) => g.status === 'in_progress').length },
          { label: 'Completed', value: 'completed', count: gigs.filter((g) => g.status === 'completed').length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusTab(tab.value)}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              statusTab === tab.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label} <span className={`ml-1 text-xs ${statusTab === tab.value ? 'text-indigo-200' : 'text-gray-400'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <Card padding={false}>
        <Table>
          <TableHead>
            <TableHeader>Gig</TableHeader>
            <TableHeader>Budget</TableHeader>
            <TableHeader>Recruitment Pipeline</TableHeader>
            <TableHeader>Deadline</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>
                  <EmptyState
                    title="No gigs yet"
                    description="Post a gig to start recruiting."
                  />
                </TableCell>
              </TableRow>
            )}
            {filtered.map((gig) => (
              <TableRow key={gig.id}>
                <TableCell>
                  <div>
                    <p className="font-semibold text-gray-900">{gig.title}</p>
                    <p className="text-xs text-gray-500">Posted {new Date(gig.createdAt).toLocaleDateString()}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-emerald-600">${gig.budget}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="flex items-center gap-0.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600" title="Total applicants">
                        <UserGroupIcon className="h-3 w-3" /> {gig.applicants}
                      </span>
                      <span className="flex items-center gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600" title="Pending">
                        <ClockIcon className="h-3 w-3" /> {gig.pending}
                      </span>
                      <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600" title="Accepted">
                        <CheckCircleIcon className="h-3 w-3" /> {gig.accepted}
                      </span>
                      <span className="flex items-center gap-0.5 rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600" title="Rejected">
                        <XCircleIcon className="h-3 w-3" /> {gig.rejected}
                      </span>
                    </div>
                  </div>
                  {/* Mini progress bar */}
                  {gig.applicants > 0 && (
                    <div className="mt-1.5 flex h-1.5 rounded-full overflow-hidden bg-gray-100 w-32">
                      <div className="bg-emerald-500 transition-all" style={{ width: `${(gig.accepted / gig.applicants) * 100}%` }} />
                      <div className="bg-amber-400 transition-all" style={{ width: `${(gig.pending / gig.applicants) * 100}%` }} />
                      <div className="bg-red-400 transition-all" style={{ width: `${(gig.rejected / gig.applicants) * 100}%` }} />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-gray-500">{new Date(gig.deadline).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge color={statusColor[gig.status]} dot>{statusLabel[gig.status]}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link to="/student/applicants" className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="View applicants">
                      <UserGroupIcon className="h-4 w-4" />
                    </Link>
                    <button onClick={() => setViewGig(gig)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="View">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => openEdit(gig)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Edit">
                      <PencilSquareIcon className="h-4 w-4" />
                    </button>
                    <button onClick={() => setDeleteGig(gig)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Delete confirmation */}
      <Modal open={!!deleteGig} onClose={() => setDeleteGig(null)} title="Delete Gig" size="sm">
        {deleteGig && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-800">Are you sure?</p>
                <p className="text-sm text-red-600 mt-1">This will permanently delete "<strong>{deleteGig.title}</strong>" and reject all pending applicants.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleDelete}>Yes, Delete</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteGig(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* View Gig modal */}
      <Modal open={!!viewGig} onClose={() => setViewGig(null)} title="Gig Details">
        {viewGig && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{viewGig.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5 capitalize">{viewGig.category}</p>
              </div>
              <Badge color={statusColor[viewGig.status]} dot>{statusLabel[viewGig.status]}</Badge>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BriefcaseIcon,    label: 'Budget',   value: `$${viewGig.budget}`, cls: 'text-emerald-600 font-semibold' },
                { icon: CalendarDaysIcon, label: 'Deadline', value: new Date(viewGig.deadline).toLocaleDateString() },
                { icon: CalendarDaysIcon, label: 'Posted',   value: new Date(viewGig.createdAt).toLocaleDateString() },
                { icon: TagIcon,          label: 'Category', value: viewGig.category, cls: 'capitalize' },
              ].map(({ icon: Icon, label, value, cls = '' }) => (
                <div key={label} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-gray-100">
                    <Icon className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className={`text-sm font-medium text-gray-800 ${cls}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recruitment pipeline */}
            <div className="rounded-xl border border-gray-100 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Recruitment Pipeline</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Total',    value: viewGig.applicants, cls: 'text-indigo-600',  bg: 'bg-indigo-50'  },
                  { label: 'Pending',  value: viewGig.pending,    cls: 'text-amber-600',   bg: 'bg-amber-50'   },
                  { label: 'Accepted', value: viewGig.accepted,   cls: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Rejected', value: viewGig.rejected,   cls: 'text-red-500',     bg: 'bg-red-50'     },
                ].map((p) => (
                  <div key={p.label} className={`rounded-xl ${p.bg} py-3`}>
                    <p className={`text-2xl font-bold ${p.cls}`}>{p.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.label}</p>
                  </div>
                ))}
              </div>
              {viewGig.applicants > 0 && (
                <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div className="bg-emerald-500" style={{ width: `${(viewGig.accepted / viewGig.applicants) * 100}%` }} />
                  <div className="bg-amber-400"   style={{ width: `${(viewGig.pending  / viewGig.applicants) * 100}%` }} />
                  <div className="bg-red-400"     style={{ width: `${(viewGig.rejected / viewGig.applicants) * 100}%` }} />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link to="/student/applicants" className="flex-1">
                <Button variant="primary" className="w-full">
                  <UserGroupIcon className="h-4 w-4 mr-2" /> View Applicants
                </Button>
              </Link>
              <Button variant="secondary" onClick={() => { setViewGig(null); openEdit(viewGig); }}>
                <PencilSquareIcon className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Gig modal */}
      <Modal open={!!editGig} onClose={() => setEditGig(null)} title="Edit Gig">
        {editGig && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Gig Title</label>
              <input
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                value={editForm.title}
                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget ($)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  value={editForm.budget}
                  onChange={(e) => setEditForm((p) => ({ ...p, budget: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Deadline</label>
                <input
                  type="date"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  value={editForm.deadline}
                  onChange={(e) => setEditForm((p) => ({ ...p, deadline: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  value={editForm.category}
                  onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                >
                  <option value="web">Web</option>
                  <option value="design">Design</option>
                  <option value="data">Data</option>
                  <option value="writing">Writing</option>
                  <option value="mobile">Mobile</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="primary" className="flex-1" onClick={handleEditSave}>Save Changes</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setEditGig(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
