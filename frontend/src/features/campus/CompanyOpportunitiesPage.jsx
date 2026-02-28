import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PageHeader, Card, CardHeader, Badge, Button, Modal, Input, Textarea, SearchInput, EmptyState,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  BuildingOffice2Icon,
  ChartBarIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const OPPORTUNITIES = [];

const typeColor = { Internship: 'blue', 'Full-time': 'green', Contract: 'purple', 'Part-time': 'amber' };
const statusColor = { active: 'green', closed: 'gray', draft: 'yellow' };

export default function CompanyOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState(OPPORTUNITIES);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteOpp, setDeleteOpp] = useState(null);
  const [editOpp, setEditOpp] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [form, setForm] = useState({
    company: '', role: '', type: 'Internship', location: '', salary: '', description: '', requirements: '', deadline: '',
  });

  const filtered = opportunities.filter((o) => {
    const matchSearch = o.company.toLowerCase().includes(search.toLowerCase()) || o.role.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || o.type === typeFilter;
    return matchSearch && matchType;
  });
  const totalApplicants = opportunities.reduce((total, opp) => total + opp.applicants, 0);
  const avgApplicants = opportunities.length ? Math.round(totalApplicants / opportunities.length) : 0;
  const isEmpty = opportunities.length === 0;

  const handleCreate = () => {
    const newOpp = {
      id: `opp-${Date.now()}`,
      ...form,
      requirements: form.requirements.split(',').map((r) => r.trim()).filter(Boolean),
      postedAt: new Date().toISOString().split('T')[0],
      applicants: 0,
      status: 'active',
    };
    setOpportunities((prev) => [newOpp, ...prev]);
    setShowCreateModal(false);
    setForm({ company: '', role: '', type: 'Internship', location: '', salary: '', description: '', requirements: '', deadline: '' });
  };

  const handleDelete = () => {
    setOpportunities((prev) => prev.filter((o) => o.id !== deleteOpp.id));
    setDeleteOpp(null);
  };

  const openEdit = (opp) => {
    setEditOpp(opp);
    setEditForm({
      company: opp.company, role: opp.role, type: opp.type,
      location: opp.location, salary: opp.salary,
      description: opp.description,
      requirements: opp.requirements.join(', '),
      deadline: opp.deadline, status: opp.status,
    });
  };

  const handleEditSave = () => {
    setOpportunities((prev) => prev.map((o) =>
      o.id === editOpp.id
        ? { ...o, ...editForm, requirements: editForm.requirements.split(',').map((r) => r.trim()).filter(Boolean) }
        : o,
    ));
    setEditOpp(null);
  };

  return (
    <div>
      <PageHeader
        title="Company Opportunities"
        subtitle="Post and manage company hiring opportunities for students."
        actions={
          <Button variant="gradient" onClick={() => setShowCreateModal(true)}>
            <PlusIcon className="h-4 w-4 mr-2" /> Post Opportunity
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Total Listings', value: opportunities.length, cls: 'text-indigo-600', bg: 'bg-indigo-50', Icon: BuildingOffice2Icon },
          { label: 'Active', value: opportunities.filter((o) => o.status === 'active').length, cls: 'text-emerald-600', bg: 'bg-emerald-50', Icon: CheckCircleIcon },
          { label: 'Total Applicants', value: totalApplicants, cls: 'text-blue-600', bg: 'bg-blue-50', Icon: UserGroupIcon },
          { label: 'Avg. Applicants', value: avgApplicants, cls: 'text-amber-600', bg: 'bg-amber-50', Icon: ChartBarIcon },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                <c.Icon className={`h-5 w-5 ${c.cls}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by company or role..." />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-700 shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-gray-300"
          >
            <option value="all">All Types</option>
            <option value="Internship">Internship</option>
            <option value="Full-time">Full-time</option>
            <option value="Contract">Contract</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>
      </Card>

      {/* Opportunities Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BuildingOffice2Icon}
          title={isEmpty ? 'No opportunities yet' : 'No opportunities found'}
          description={isEmpty ? 'Create the first opportunity to get started.' : 'Try adjusting your search or create a new one.'}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((opp) => (
            <Card key={opp.id} className="hover:ring-indigo-200 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <BuildingOffice2Icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{opp.role}</h3>
                    <p className="text-sm text-gray-500">{opp.company}</p>
                  </div>
                </div>
                <Badge color={statusColor[opp.status]}>{opp.status}</Badge>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{opp.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {opp.requirements.map((r) => (
                  <span key={r} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{r}</span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Badge color={typeColor[opp.type]} size="sm">{opp.type}</Badge></span>
                <span className="flex items-center gap-1"><MapPinIcon className="h-3.5 w-3.5" /> {opp.location}</span>
                <span className="flex items-center gap-1"><CurrencyDollarIcon className="h-3.5 w-3.5" /> {opp.salary}</span>
                <span className="flex items-center gap-1"><CalendarIcon className="h-3.5 w-3.5" /> Due {new Date(opp.deadline).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="flex items-center gap-1 text-sm text-indigo-600 font-medium">
                  <UserGroupIcon className="h-4 w-4" /> {opp.applicants} applicants
                </span>
                <div className="flex items-center gap-1">
                  <Link to={`/campus/opportunities/${opp.id}/applicants`} className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="View applicants">
                    <UserGroupIcon className="h-4 w-4" />
                  </Link>
                  <button onClick={() => openEdit(opp)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Edit">
                    <PencilSquareIcon className="h-4 w-4" />
                  </button>
                  <button onClick={() => setDeleteOpp(opp)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ── Create Opportunity Modal ── */}
      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)} title="Post Company Opportunity" size="lg">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Company Name" placeholder="e.g. TechCorp Inc." value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            <Input label="Role Title" placeholder="e.g. Frontend Developer Intern" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} />
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <Input label="Location" placeholder="e.g. Remote / New York" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
            <Input label="Salary/Stipend" placeholder="e.g. $2,000/mo" value={form.salary} onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))} />
            <Input label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
          </div>
          <Textarea label="Description" rows={3} placeholder="Describe the opportunity..." value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <Input label="Requirements (comma-separated)" placeholder="React, TypeScript, Git" value={form.requirements} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="gradient" className="flex-1" onClick={handleCreate} disabled={!form.company || !form.role}>
              <PlusIcon className="h-4 w-4 mr-2" /> Post Opportunity
            </Button>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* ── Edit Opportunity Modal ── */}
      <Modal open={!!editOpp} onClose={() => setEditOpp(null)} title="Edit Opportunity" size="lg">
        {editOpp && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Company Name</label>
                <input type="text" value={editForm.company} onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Role Title</label>
                <input type="text" value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Type</label>
                <select value={editForm.type} onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option>Internship</option>
                  <option>Full-time</option>
                  <option>Contract</option>
                  <option>Part-time</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Location</label>
                <input type="text" value={editForm.location} onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Salary / Stipend</label>
                <input type="text" value={editForm.salary} onChange={(e) => setEditForm((f) => ({ ...f, salary: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Deadline</label>
                <input type="date" value={editForm.deadline} onChange={(e) => setEditForm((f) => ({ ...f, deadline: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Description</label>
              <textarea rows={3} value={editForm.description} onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Requirements (comma-separated)</label>
              <input type="text" value={editForm.requirements} onChange={(e) => setEditForm((f) => ({ ...f, requirements: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Status</label>
              <select value={editForm.status} onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="gradient" className="flex-1" onClick={handleEditSave} disabled={!editForm.company || !editForm.role}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditOpp(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={!!deleteOpp} onClose={() => setDeleteOpp(null)} title="Delete Opportunity" size="sm">
        {deleteOpp && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Delete <strong>{deleteOpp.role}</strong> at <strong>{deleteOpp.company}</strong>? This will also remove all applicant data.</p>
            <div className="flex gap-3">
              <Button variant="danger" className="flex-1" onClick={handleDelete}>Yes, Delete</Button>
              <Button variant="secondary" className="flex-1" onClick={() => setDeleteOpp(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
