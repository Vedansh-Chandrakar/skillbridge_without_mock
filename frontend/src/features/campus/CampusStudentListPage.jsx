import { useState } from 'react';
import {
  PageHeader, Button, Badge, Avatar, Card, SearchInput, Modal,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  EnvelopeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const INITIAL_STUDENTS = [];

const modeColor = { Freelancer: 'blue', Recruiter: 'purple', Both: 'cyan' };

export default function CampusStudentListPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [search, setSearch] = useState('');
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', mode: '', message: '' });
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openEdit = (s) => {
    setEditStudent(s);
    setEditForm({ name: s.name, email: s.email, mode: s.mode, verified: s.verified });
  };

  const handleEditSave = () => {
    setStudents((prev) => prev.map((s) =>
      s.id === editStudent.id ? { ...s, ...editForm } : s,
    ));
    setEditStudent(null);
  };

  const handleDelete = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteStudent.id));
    setDeleteStudent(null);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    const name = inviteForm.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newStudent = {
      id: Date.now(),
      name,
      email: inviteForm.email,
      mode: inviteForm.mode || 'Freelancer',
      skills: [],
      gigs: 0,
      rating: null,
      verified: false,
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setStudents((prev) => [newStudent, ...prev]);
    setInviteSuccess(true);
    setTimeout(() => {
      setShowInvite(false);
      setInviteForm({ email: '', mode: '', message: '' });
      setInviteSuccess(false);
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Manage and monitor students in your campus."
        actions={
          <Button variant="gradient" onClick={() => { setInviteForm({ email: '', mode: '', message: '' }); setInviteSuccess(false); setShowInvite(true); }}>
            <EnvelopeIcon className="h-4 w-4 mr-2" />
            Invite Student
          </Button>
        }
      />

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Total', value: students.length, cls: 'text-gray-900' },
          { label: 'Freelancers', value: students.filter((s) => s.mode === 'Freelancer' || s.mode === 'Both').length, cls: 'text-blue-600' },
          { label: 'Recruiters', value: students.filter((s) => s.mode === 'Recruiter' || s.mode === 'Both').length, cls: 'text-purple-600' },
          { label: 'Unverified', value: students.filter((s) => !s.verified).length, cls: 'text-amber-600' },
        ].map((c) => (
          <Card key={c.label}>
            <p className="text-sm text-gray-500">{c.label}</p>
            <p className={`mt-1 text-2xl font-bold ${c.cls}`}>{c.value}</p>
          </Card>
        ))}
      </div>

      <Card padding={false}>
        <div className="p-4 border-b border-gray-100">
          <SearchInput value={search} onChange={setSearch} placeholder="Search students..." />
        </div>
        <Table>
          <TableHead>
            <TableHeader>Student</TableHeader>
            <TableHeader>Mode</TableHeader>
            <TableHeader>Skills</TableHeader>
            <TableHeader>Gigs</TableHeader>
            <TableHeader>Rating</TableHeader>
            <TableHeader>Status</TableHeader>
            <TableHeader className="text-right">Actions</TableHeader>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">
                  No students yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={s.name} size="sm" status={s.verified ? 'online' : 'offline'} />
                      <div>
                        <p className="font-semibold text-gray-900">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={modeColor[s.mode]} size="sm">{s.mode}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {s.skills.length > 0 ? s.skills.slice(0, 3).map((sk) => (
                        <span key={sk} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">{sk}</span>
                      )) : <span className="text-xs text-gray-400">—</span>}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-gray-700">{s.gigs}</TableCell>
                  <TableCell>
                    {s.rating ? (
                      <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                        <span>★</span> {s.rating}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge color={s.verified ? 'green' : 'yellow'} dot size="sm">
                      {s.verified ? 'Verified' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setViewStudent(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors" title="View">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => openEdit(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Edit">
                        <PencilSquareIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => setDeleteStudent(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ── View Modal ── */}
      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details" size="md">
        {viewStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar name={viewStudent.name} size="lg" status={viewStudent.verified ? 'online' : 'offline'} />
              <div>
                <p className="text-lg font-bold text-gray-900">{viewStudent.name}</p>
                <p className="text-sm text-gray-500">{viewStudent.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge color={modeColor[viewStudent.mode]} size="sm">{viewStudent.mode}</Badge>
                  <Badge color={viewStudent.verified ? 'green' : 'yellow'} dot size="sm">{viewStudent.verified ? 'Verified' : 'Pending'}</Badge>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-xs text-indigo-400 font-semibold uppercase">Gigs</p>
                <p className="text-xl font-bold text-indigo-700 mt-1">{viewStudent.gigs}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-xs text-amber-400 font-semibold uppercase">Rating</p>
                <p className="text-xl font-bold text-amber-700 mt-1">{viewStudent.rating ?? 'N/A'}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-400 font-semibold uppercase">Joined</p>
                <p className="text-sm font-bold text-gray-700 mt-1">{viewStudent.joinedAt}</p>
              </div>
            </div>
            {viewStudent.skills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {viewStudent.skills.map((sk) => (
                    <span key={sk} className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">{sk}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end pt-1">
              <Button variant="secondary" onClick={() => setViewStudent(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editStudent} onClose={() => setEditStudent(null)} title="Edit Student" size="md">
        {editStudent && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Mode</label>
              <select
                value={editForm.mode}
                onChange={(e) => setEditForm((f) => ({ ...f, mode: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option>Freelancer</option>
                <option>Recruiter</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Verification Status</label>
              <select
                value={editForm.verified ? 'verified' : 'pending'}
                onChange={(e) => setEditForm((f) => ({ ...f, verified: e.target.value === 'verified' }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="gradient" onClick={handleEditSave}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setEditStudent(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal open={!!deleteStudent} onClose={() => setDeleteStudent(null)} title="Remove Student" size="sm">
        {deleteStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
              <Avatar name={deleteStudent.name} size="sm" />
              <div>
                <p className="font-semibold text-gray-900">{deleteStudent.name}</p>
                <p className="text-xs text-gray-500">{deleteStudent.email}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">Are you sure you want to remove this student? This action cannot be undone.</p>
            <div className="flex gap-2 pt-1">
              <Button variant="danger" onClick={handleDelete}>Remove Student</Button>
              <Button variant="secondary" onClick={() => setDeleteStudent(null)}>Cancel</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Invite Student Modal ── */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Invite Student">
        {inviteSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-base font-semibold text-gray-900">Invite Sent!</p>
            <p className="text-sm text-gray-500">Student has been added and notified.</p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleInvite}>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Email Address *</label>
              <input
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) => setInviteForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="student@campus.edu"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Suggested Mode</label>
              <select
                value={inviteForm.mode}
                onChange={(e) => setInviteForm((f) => ({ ...f, mode: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Select mode</option>
                <option>Freelancer</option>
                <option>Recruiter</option>
                <option>Both</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Personal Message</label>
              <textarea
                rows={3}
                value={inviteForm.message}
                onChange={(e) => setInviteForm((f) => ({ ...f, message: e.target.value }))}
                placeholder="Welcome to our campus platform!"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" type="button" onClick={() => setShowInvite(false)}>Cancel</Button>
              <Button type="submit">Send Invite</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
