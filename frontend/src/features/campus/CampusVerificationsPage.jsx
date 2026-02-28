import { useState, useEffect, useCallback } from 'react';
import {
  PageHeader, Card, Badge, Avatar, Button, Modal,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import { CheckIcon, XMarkIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { CAMPUS_ENDPOINTS } from '@/config/api';

const statusColor  = { pending: 'yellow', approved: 'green', rejected: 'red' };
const modeColor    = { Freelancer: 'blue', Recruiter: 'purple', Both: 'cyan' };

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('sb_token') || ''}`,
});

export default function CampusVerificationsPage() {
  const [requests, setRequests]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [actioning, setActioning] = useState({}); // { [id]: 'approving'|'rejecting' }
  const [viewRequest, setViewRequest] = useState(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchVerifications = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res  = await fetch(CAMPUS_ENDPOINTS.VERIFICATIONS, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load verifications.');
      setRequests(data.data);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchVerifications(); }, [fetchVerifications]);

  const pending  = requests.filter((r) => r.status === 'pending');
  const approved = requests.filter((r) => r.status === 'approved');
  const rejected = requests.filter((r) => r.status === 'rejected');

  // ── Approve / Reject ───────────────────────────────────
  const handleAction = async (id, action) => {
    const url = action === 'approved'
      ? CAMPUS_ENDPOINTS.APPROVE_VERIFICATION(id)
      : CAMPUS_ENDPOINTS.REJECT_VERIFICATION(id);

    setActioning((prev) => ({ ...prev, [id]: action === 'approved' ? 'approving' : 'rejecting' }));
    try {
      const res  = await fetch(url, { method: 'PATCH', headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Action failed.');
      setRequests((prev) => prev.map((r) => String(r.id) === String(id) ? data.data : r));
      // If viewing this student, close the modal
      if (viewRequest && String(viewRequest.id) === String(id)) setViewRequest(data.data);
    } catch (err) { alert(err.message); }
    finally { setActioning((prev) => ({ ...prev, [id]: null })); }
  };

  return (
    <div>
      <PageHeader
        title="Student Verifications"
        subtitle={`${pending.length} students awaiting verification.`}
      />

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <DocumentTextIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-amber-600">{pending.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
              <CheckIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Approved</p>
              <p className="text-xl font-bold text-emerald-600">{approved.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
              <XMarkIcon className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Rejected</p>
              <p className="text-xl font-bold text-red-600">{rejected.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <Table>
          <TableHead>
            <TableHeader>Student</TableHeader>
            <TableHeader>Mode</TableHeader>
            <TableHeader>Registered</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-sm text-gray-400">
                  Loading…
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-sm text-red-500">
                  {error}{' '}<button onClick={fetchVerifications} className="underline ml-1">Retry</button>
                </TableCell>
              </TableRow>
            ) : requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-sm text-gray-400">
                  No students in your campus yet.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={r.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-500">{r.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge color={modeColor[r.mode]} size="sm">{r.mode}</Badge></TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(r.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColor[r.status]} dot>{r.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAction(r.id, 'approved')}
                          disabled={!!actioning[r.id]}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'rejected')}
                          disabled={!!actioning[r.id]}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewRequest(r)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 capitalize">{r.status}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
      {/* ── View Document Modal ── */}
      <Modal open={!!viewRequest} onClose={() => setViewRequest(null)} title="Verification Request" size="md">
        {viewRequest && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewRequest.name} size="lg" />
              <div>
                <p className="text-lg font-bold text-gray-900">{viewRequest.name}</p>
                <p className="text-sm text-gray-500">{viewRequest.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color={statusColor[viewRequest.status]} dot size="sm">{viewRequest.status}</Badge>
                  <Badge color={modeColor[viewRequest.mode]} size="sm">{viewRequest.mode}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Mode</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewRequest.mode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Registered On</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{new Date(viewRequest.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Campus</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewRequest.campus}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                <p className="text-sm font-medium text-gray-900 capitalize mt-0.5">{viewRequest.status}</p>
              </div>
            </div>

            {viewRequest.status === 'approved' && (
              <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium">
                ✓ This student is verified and active on the platform.
              </div>
            )}
            {viewRequest.status === 'rejected' && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                ✗ This student's verification has been rejected.
              </div>
            )}

            {viewRequest.status === 'pending' ? (
              <div className="flex gap-2 pt-1">
                <Button
                  variant="success"
                  className="flex-1"
                  disabled={!!actioning[viewRequest.id]}
                  onClick={() => handleAction(viewRequest.id, 'approved')}
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  {actioning[viewRequest.id] === 'approving' ? 'Approving…' : 'Approve'}
                </Button>
                <Button
                  variant="danger"
                  className="flex-1"
                  disabled={!!actioning[viewRequest.id]}
                  onClick={() => handleAction(viewRequest.id, 'rejected')}
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  {actioning[viewRequest.id] === 'rejecting' ? 'Rejecting…' : 'Reject'}
                </Button>
              </div>
            ) : (
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setViewRequest(null)}>Close</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
