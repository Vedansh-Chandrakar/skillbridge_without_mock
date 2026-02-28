import { useState } from 'react';
import {
  PageHeader, Card, Badge, Avatar, Button, Modal,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import { CheckIcon, XMarkIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const REQUESTS = [];

const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red' };

export default function CampusVerificationsPage() {
  const [requests, setRequests] = useState(REQUESTS);
  const [viewRequest, setViewRequest] = useState(null);
  const pending = requests.filter((r) => r.status === 'pending');

  const handleAction = (id, action) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r)),
    );
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
              <p className="text-xl font-bold text-emerald-600">
                {requests.filter((r) => r.status === 'approved').length}
              </p>
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
              <p className="text-xl font-bold text-red-600">
                {requests.filter((r) => r.status === 'rejected').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <Table>
          <TableHead>
            <TableHeader>Student</TableHeader>
            <TableHeader>Document</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-sm text-gray-400">
                  No verification requests yet.
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
                  <TableCell className="text-gray-600">{r.document}</TableCell>
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
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          title="Approve"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(r.id, 'rejected')}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Reject"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewRequest(r)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                          title="View document"
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
                  <Badge color="blue" size="sm">{viewRequest.mode}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Document Type</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewRequest.document}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Submitted On</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{new Date(viewRequest.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Requested Mode</p>
                <p className="text-sm font-medium text-gray-900 mt-0.5">{viewRequest.mode}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">Status</p>
                <p className="text-sm font-medium text-gray-900 capitalize mt-0.5">{viewRequest.status}</p>
              </div>
            </div>

            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-2 bg-gray-50">
              <DocumentTextIcon className="h-10 w-10 text-gray-300" />
              <p className="text-sm font-medium text-gray-600">{viewRequest.document}</p>
              <p className="text-xs text-gray-400">Submitted by {viewRequest.name}</p>
              <button className="mt-2 rounded-lg bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors">
                Download PDF
              </button>
            </div>

            {viewRequest.status === 'pending' ? (
              <div className="flex gap-2 pt-1">
                <Button variant="success" className="flex-1" onClick={() => { handleAction(viewRequest.id, 'approved'); setViewRequest(null); }}>
                  <CheckIcon className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button variant="danger" className="flex-1" onClick={() => { handleAction(viewRequest.id, 'rejected'); setViewRequest(null); }}>
                  <XMarkIcon className="h-4 w-4 mr-1" /> Reject
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
