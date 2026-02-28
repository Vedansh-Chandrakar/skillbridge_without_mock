import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader, Button, Badge, Avatar, SearchInput, Card, Modal, Input,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import { PlusIcon, PencilSquareIcon, TrashIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ADMIN_ENDPOINTS } from '@/config/api';

const statusColor = { active: 'green', pending: 'yellow', inactive: 'gray' };

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('sb_token') || ''}`,
});

export default function CampusManagementPage() {
  const [campuses, setCampuses]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [search, setSearch]         = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm]             = useState({ name: '', domain: '', adminEmail: '' });
  const [formError, setFormError]   = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [viewCampus, setViewCampus] = useState(null);
  const [editCampus, setEditCampus] = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [deleteCampus, setDeleteCampus] = useState(null);

  // ── Requests tab ──
  const [activeTab, setActiveTab]           = useState('campuses');
  const [campusRequests, setCampusRequests] = useState([]);
  const [reqLoading, setReqLoading]         = useState(false);
  const [reqError, setReqError]             = useState('');
  const [reqAction, setReqAction]           = useState({}); // { [id]: 'approving'|'rejecting' }

  // ── Fetch ──
  const fetchCampuses = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.CAMPUSES, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load campuses.');
      setCampuses(data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  const fetchCampusRequests = useCallback(async () => {
    setReqLoading(true); setReqError('');
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.CAMPUS_REQUESTS, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load requests.');
      setCampusRequests(data.data);
    } catch (err) { setReqError(err.message); }
    finally { setReqLoading(false); }
  }, []);

  useEffect(() => { fetchCampuses(); fetchCampusRequests(); }, [fetchCampuses, fetchCampusRequests]);

  const filtered = campuses.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── Add ── */
  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError(''); setSubmitting(true);
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.CAMPUSES, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add campus.');
      setCampuses((prev) => [data.data, ...prev]);
      setForm({ name: '', domain: '', adminEmail: '' });
      setShowAddModal(false);
    } catch (err) { setFormError(err.message); }
    finally { setSubmitting(false); }
  };

  /* ── Edit ── */
  const openEdit = (campus) => {
    setEditCampus(campus);
    setEditForm({ name: campus.name, domain: campus.domain, status: campus.status });
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.UPDATE_CAMPUS(editCampus.id), {
        method: 'PATCH', headers: authHeaders(),
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update campus.');
      setCampuses((prev) => prev.map((c) => String(c.id) === String(editCampus.id) ? data.data : c));
      setEditCampus(null);
    } catch (err) { alert(err.message); }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.DELETE_CAMPUS(deleteCampus.id), {
        method: 'DELETE', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete campus.');
      setCampuses((prev) => prev.filter((c) => String(c.id) !== String(deleteCampus.id)));
      setDeleteCampus(null);
    } catch (err) { alert(err.message); }
  };

  /* ── Campus Requests ── */
  const handleApproveRequest = async (req) => {
    setReqAction((prev) => ({ ...prev, [req.id]: 'approving' }));
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.APPROVE_CAMPUS_REQUEST(req.id), {
        method: 'PATCH', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to approve.');
      setCampusRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'approved' } : r));
      fetchCampuses();
    } catch (err) { alert(err.message); }
    finally { setReqAction((prev) => ({ ...prev, [req.id]: null })); }
  };

  const handleRejectRequest = async (req) => {
    setReqAction((prev) => ({ ...prev, [req.id]: 'rejecting' }));
    try {
      const res  = await fetch(ADMIN_ENDPOINTS.REJECT_CAMPUS_REQUEST(req.id), {
        method: 'PATCH', headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reject.');
      setCampusRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, status: 'rejected' } : r));
    } catch (err) { alert(err.message); }
    finally { setReqAction((prev) => ({ ...prev, [req.id]: null })); }
  };

  const pendingCount = campusRequests.filter((r) => r.status === 'pending').length;

  return (
    <div>
      <PageHeader
        title="Campus Management"
        subtitle="Manage all registered campuses on the platform"
        actions={
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <button
                onClick={() => setActiveTab('requests')}
                className="flex items-center gap-1.5 rounded-xl bg-yellow-50 px-3 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 transition-colors"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white">
                  {pendingCount}
                </span>
                Campus Requests
              </button>
            )}
            <Button onClick={() => setShowAddModal(true)}>
              <PlusIcon className="h-4 w-4" /> Add Campus
            </Button>
          </div>
        }
      />

      <Card padding={false}>
        {/* ── Tab bar ── */}
        <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('campuses')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'campuses'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Campuses
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'requests'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Campus Requests
            {pendingCount > 0 && (
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Campuses search bar ── */}
        {activeTab === 'campuses' && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search campuses..."
            className="w-64"
          />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{filtered.length} campuses</span>
          </div>
        </div>
        )}

        {activeTab === 'campuses' && (
        <Table>
          <TableHead>
            <TableHeader>Campus</TableHeader>
            <TableHeader>Domain</TableHeader>
            <TableHeader>Admin Email</TableHeader>
            <TableHeader>Students</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader>Joined</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">Loading campuses...</TableCell></TableRow>
            ) : error ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-sm text-red-500">{error} <button onClick={fetchCampuses} className="underline ml-1">Retry</button></TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                  No campuses found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((campus) => (
                <TableRow key={campus.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={campus.name} size="sm" color="blue" />
                      <span className="font-semibold text-gray-900">{campus.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{campus.domain}</TableCell>
                  <TableCell className="text-gray-500">{campus.adminEmail}</TableCell>
                  <TableCell>{campus.students?.toLocaleString() ?? 0}</TableCell>
                  <TableCell>
                    <Badge color={statusColor[campus.status]} dot>{campus.status}</Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(campus.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setViewCampus(campus)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="View"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openEdit(campus)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        aria-label="Edit"
                      >
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteCampus(campus)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Delete"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}

        {/* ── Requests tab ── */}
        {activeTab === 'requests' && (
          <div>
            {reqLoading ? (
              <div className="py-10 text-center text-sm text-gray-400">Loading campus requests...</div>
            ) : reqError ? (
              <div className="py-10 text-center text-sm text-red-500">
                {reqError}{' '}
                <button onClick={fetchCampusRequests} className="underline ml-1">Retry</button>
              </div>
            ) : campusRequests.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-400">No campus requests yet.</div>
            ) : (
              <Table>
                <TableHead>
                  <TableHeader>Campus Name</TableHeader>
                  <TableHeader>Domain</TableHeader>
                  <TableHeader>Contact Email</TableHeader>
                  <TableHeader>Message</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Requested</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableHead>
                <TableBody>
                  {campusRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar name={req.campusName} size="sm" color="yellow" />
                          <span className="font-semibold text-gray-900">{req.campusName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{req.domain || '—'}</TableCell>
                      <TableCell className="text-gray-500">{req.contactEmail || '—'}</TableCell>
                      <TableCell className="text-gray-500 max-w-xs truncate">{req.message || '—'}</TableCell>
                      <TableCell>
                        <Badge
                          color={{ pending: 'yellow', approved: 'green', rejected: 'red' }[req.status]}
                          dot
                        >
                          {req.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApproveRequest(req)}
                              disabled={!!reqAction[req.id]}
                              className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-green-50 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-50"
                            >
                              {reqAction[req.id] === 'approving' ? 'Approving…' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req)}
                              disabled={!!reqAction[req.id]}
                              className="rounded-lg px-2.5 py-1 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {reqAction[req.id] === 'rejecting' ? 'Rejecting…' : 'Reject'}
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Done</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </Card>

      {/* ── Add Campus Modal ── */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Campus">
        <form className="space-y-4" onSubmit={handleAdd}>
          <Input label="Campus Name" placeholder="e.g. MIT" value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="Domain" placeholder="e.g. mit.edu" value={form.domain}
            onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))} required />
          <Input label="Admin Email" type="email" placeholder="admin@mit.edu" value={form.adminEmail}
            onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))} required />
          {formError && <p className="text-xs text-red-500">{formError}</p>}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Campus'}</Button>
          </div>
        </form>
      </Modal>

      {/* ── View Campus Modal ── */}
      <Modal open={!!viewCampus} onClose={() => setViewCampus(null)} title="Campus Details">
        {viewCampus && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewCampus.name} size="lg" color="blue" />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{viewCampus.name}</h3>
                <p className="text-sm text-gray-500">{viewCampus.domain}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Admin Email', value: viewCampus.adminEmail },
                { label: 'Students', value: viewCampus.students?.toLocaleString() ?? 0 },
                { label: 'Status', value: <Badge color={statusColor[viewCampus.status]} dot>{viewCampus.status}</Badge> },
                { label: 'Joined', value: new Date(viewCampus.joinedAt).toLocaleDateString() },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium text-gray-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={() => setViewCampus(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Campus Modal ── */}
      <Modal open={!!editCampus} onClose={() => setEditCampus(null)} title="Edit Campus">
        {editCampus && (
          <form className="space-y-4" onSubmit={handleEdit}>
            <Input label="Campus Name" value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} required />
            <Input label="Domain" value={editForm.domain}
              onChange={(e) => setEditForm((f) => ({ ...f, domain: e.target.value }))} required />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editForm.status}
                onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button variant="secondary" type="button" onClick={() => setEditCampus(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deleteCampus} onClose={() => setDeleteCampus(null)} title="Delete Campus">
        {deleteCampus && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl bg-red-50 p-4">
              <XMarkIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                Are you sure you want to delete <span className="font-semibold">{deleteCampus.name}</span>?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setDeleteCampus(null)}>Cancel</Button>
              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Delete Campus
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
