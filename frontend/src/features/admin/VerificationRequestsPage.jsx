import { useState } from 'react';
import {
  PageHeader, Button, Badge, Avatar, Card, Modal,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  CheckIcon, XMarkIcon, EyeIcon,
  DocumentTextIcon, CalendarDaysIcon, EnvelopeIcon, BuildingLibraryIcon, UserCircleIcon,
} from '@heroicons/react/24/outline';

const VERIFICATIONS = [];

const statusColor = { pending: 'yellow', approved: 'green', rejected: 'red' };
const typeColor   = { campus: 'blue',    student: 'indigo' };

function ViewModal({ req, onClose, onApprove, onReject }) {
  if (!req) return null;
  return (
    <Modal open={!!req} onClose={onClose} title="Verification Request Details">
      {/* Header */}
      <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 mb-5">
        <Avatar name={req.entity} size="lg" color={req.type === 'campus' ? 'blue' : 'indigo'} />
        <div>
          <h3 className="text-base font-bold text-gray-900">{req.entity}</h3>
          <div className="mt-1.5 flex gap-2">
            <Badge color={typeColor[req.type]} size="sm">{req.type}</Badge>
            <Badge color={statusColor[req.status]} dot size="sm">{req.status}</Badge>
          </div>
        </div>
      </div>

      {/* Detail rows */}
      <div className="space-y-3 mb-5">
        {[
          { icon: UserCircleIcon,       label: 'Submitted By', value: req.submittedBy },
          { icon: EnvelopeIcon,         label: 'Email',        value: req.email       },
          { icon: DocumentTextIcon,     label: 'Document',     value: req.document    },
          { icon: CalendarDaysIcon,     label: 'Submitted On', value: new Date(req.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
          { icon: BuildingLibraryIcon,  label: 'Entity Type',  value: req.type.charAt(0).toUpperCase() + req.type.slice(1) },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl border border-gray-100 px-4 py-3">
            <Icon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
              <p className="mt-0.5 text-sm font-medium text-gray-800">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mock document preview */}
      <div className="mb-5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-5 text-center">
        <DocumentTextIcon className="mx-auto h-10 w-10 text-gray-300 mb-2" />
        <p className="text-sm font-medium text-gray-500">{req.document}</p>
        <p className="text-xs text-gray-400 mt-0.5">Document preview will appear here.</p>
        <button className="mt-3 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors">
          Download PDF
        </button>
      </div>

      {/* Actions */}
      {req.status === 'pending' ? (
        <div className="flex gap-3 border-t border-gray-100 pt-4">
          <button
            onClick={() => { onReject(req.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 transition-colors"
          >
            <XMarkIcon className="h-4 w-4" /> Reject
          </button>
          <button
            onClick={() => { onApprove(req.id); onClose(); }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            <CheckIcon className="h-4 w-4" /> Approve
          </button>
        </div>
      ) : (
        <div className="flex justify-end border-t border-gray-100 pt-4">
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      )}
    </Modal>
  );
}

export default function VerificationRequestsPage() {
  const [requests, setRequests] = useState(VERIFICATIONS);
  const [viewing, setViewing] = useState(null);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  const handleAction = (id, action) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r));
  };

  return (
    <div>
      <PageHeader
        title="Verification Requests"
        subtitle={`${pendingCount} pending verification${pendingCount !== 1 ? 's' : ''}`}
      />

      <div className="grid gap-6 lg:grid-cols-3 mb-6">
        <Card>
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-1 text-3xl font-bold text-amber-600">{pendingCount}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Approved</p>
          <p className="mt-1 text-3xl font-bold text-emerald-600">
            {requests.filter((r) => r.status === 'approved').length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Rejected</p>
          <p className="mt-1 text-3xl font-bold text-red-600">
            {requests.filter((r) => r.status === 'rejected').length}
          </p>
        </Card>
      </div>

      <Card padding={false}>
        <Table>
          <TableHead>
            <TableHeader>Entity</TableHeader>
            <TableHeader>Type</TableHeader>
            <TableHeader>Submitted By</TableHeader>
            <TableHeader>Document</TableHeader>
            <TableHeader>Date</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                  No verification requests yet.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={req.entity} size="sm" color={req.type === 'campus' ? 'blue' : 'indigo'} />
                      <span className="font-semibold text-gray-900">{req.entity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={typeColor[req.type]} size="sm">{req.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-gray-900">{req.submittedBy}</p>
                      <p className="text-xs text-gray-500">{req.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-500">{req.document}</TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(req.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColor[req.status]} dot>{req.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {req.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleAction(req.id, 'approved')}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                          aria-label="Approve"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleAction(req.id, 'rejected')}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label="Reject"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewing(req)}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                          aria-label="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setViewing(req)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        aria-label="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <ViewModal
        req={viewing}
        onClose={() => setViewing(null)}
        onApprove={(id) => handleAction(id, 'approved')}
        onReject={(id) => handleAction(id, 'rejected')}
      />
    </div>
  );
}
