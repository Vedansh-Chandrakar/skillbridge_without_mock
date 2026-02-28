import { useState } from 'react';
import {
  PageHeader, Button, Badge, Avatar, SearchInput, Card, Tabs, Modal,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  FunnelIcon, XMarkIcon, ShieldExclamationIcon,
  CheckCircleIcon, TrashIcon, EyeIcon,
} from '@heroicons/react/24/outline';

const INITIAL_USERS = [];

const roleColor   = { student: 'indigo', campus: 'blue',   admin: 'purple' };
const statusColor = { active: 'green',   suspended: 'red', pending: 'yellow' };
const modeColor   = { freelancer: 'cyan', recruiter: 'purple', both: 'indigo' };

/* ── Manage modal ─────────────────────────────────────── */
function ManageModal({ user, onClose, onUpdate, onDelete }) {
  if (!user) return null;
  const isSuspended = user.status === 'suspended';

  return (
    <Modal open={!!user} onClose={onClose} title="Manage User">
      {/* User summary */}
      <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 mb-5">
        <Avatar name={user.name} size="md" status={user.status === 'active' ? 'online' : 'offline'} />
        <div>
          <p className="font-semibold text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          <div className="mt-1.5 flex gap-2 flex-wrap">
            <Badge color={roleColor[user.role]} size="sm">{user.role}</Badge>
            {user.mode && <Badge color={modeColor[user.mode]} size="sm">{user.mode}</Badge>}
            <Badge color={statusColor[user.status]} dot size="sm">{user.status}</Badge>
          </div>
        </div>
      </div>

      {/* Info rows */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        {[
          { label: 'Campus',  value: user.campus },
          { label: 'Joined',  value: new Date(user.joinedAt).toLocaleDateString() },
          { label: 'Role',    value: user.role },
          { label: 'Mode',    value: user.mode ?? '—' },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-lg bg-gray-50 px-3 py-2">
            <p className="text-[10px] font-medium text-gray-400">{label}</p>
            <p className="mt-0.5 text-sm font-semibold text-gray-800 capitalize">{value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => { onUpdate(user.id, { status: isSuspended ? 'active' : 'suspended' }); onClose(); }}
          className={`flex items-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            isSuspended
              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
          }`}
        >
          {isSuspended
            ? <><CheckCircleIcon className="h-4 w-4" /> Reactivate Account</>
            : <><ShieldExclamationIcon className="h-4 w-4" /> Suspend Account</>
          }
        </button>
        <button
          onClick={() => { onDelete(user.id); onClose(); }}
          className="flex items-center gap-2 w-full rounded-xl bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 hover:bg-red-100 transition-colors"
        >
          <TrashIcon className="h-4 w-4" /> Delete User
        </button>
      </div>

      <div className="mt-4 flex justify-end border-t border-gray-100 pt-4">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}

/* ── Filter panel modal ───────────────────────────────── */
function FilterModal({ open, filters, onChange, onReset, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Filter Users">
      <div className="space-y-4">
        {/* Role */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Role</p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'student', 'campus'].map((r) => (
              <button key={r}
                onClick={() => onChange('role', r)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                  filters.role === r ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >{r}</button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Status</p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'active', 'suspended', 'pending'].map((s) => (
              <button key={s}
                onClick={() => onChange('status', s)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                  filters.status === s ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Mode */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Student Mode</p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'freelancer', 'recruiter', 'both'].map((m) => (
              <button key={m}
                onClick={() => onChange('mode', m)}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition-all ${
                  filters.mode === m ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >{m}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-between border-t border-gray-100 pt-4">
        <button onClick={onReset} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
          Reset filters
        </button>
        <Button onClick={onClose}>Apply</Button>
      </div>
    </Modal>
  );
}

/* ── User table ───────────────────────────────────────── */
function UserTable({ users, onManage }) {
  return (
    <Table>
      <TableHead>
        <TableHeader>User</TableHeader>
        <TableHeader>Role</TableHeader>
        <TableHeader>Mode</TableHeader>
        <TableHeader>Campus</TableHeader>
        <TableHeader>Status</TableHeader>
        <TableHeader>Joined</TableHeader>
        <TableHeader className="text-right">Actions</TableHeader>
      </TableHead>
      <TableBody>
        {users.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-10 text-sm text-gray-400">No users found</TableCell>
          </TableRow>
        ) : users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar name={user.name} size="sm" status={user.status === 'active' ? 'online' : 'offline'} />
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell><Badge color={roleColor[user.role]} size="sm">{user.role}</Badge></TableCell>
            <TableCell>
              {user.mode
                ? <Badge color={modeColor[user.mode]} size="sm">{user.mode}</Badge>
                : <span className="text-gray-400">—</span>}
            </TableCell>
            <TableCell className="text-gray-500">{user.campus}</TableCell>
            <TableCell><Badge color={statusColor[user.status]} dot size="sm">{user.status}</Badge></TableCell>
            <TableCell className="text-gray-500">{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="xs" onClick={() => onManage(user)}>
                <EyeIcon className="h-3.5 w-3.5 mr-1" /> Manage
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function UserManagementPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [managingUser, setManagingUser] = useState(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ role: 'all', status: 'all', mode: 'all' });

  const handleFilterChange = (key, value) => setFilters((f) => ({ ...f, [key]: value }));
  const resetFilters = () => setFilters({ role: 'all', status: 'all', mode: 'all' });

  const handleUpdate = (id, changes) =>
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...changes } : u));

  const handleDelete = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const activeFilterCount = Object.values(filters).filter((v) => v !== 'all').length;

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
                        u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = filters.role   === 'all' || u.role   === filters.role;
    const matchStatus = filters.status === 'all' || u.status === filters.status;
    const matchMode   = filters.mode   === 'all' || u.mode   === filters.mode;
    return matchSearch && matchRole && matchStatus && matchMode;
  });

  const students     = filtered.filter((u) => u.role === 'student');
  const campusUsers  = filtered.filter((u) => u.role === 'campus');

  const tabs = [
    { label: 'All Users',   count: filtered.length,    content: <UserTable users={filtered}    onManage={setManagingUser} /> },
    { label: 'Students',    count: students.length,    content: <UserTable users={students}    onManage={setManagingUser} /> },
    { label: 'Campus Auth', count: campusUsers.length, content: <UserTable users={campusUsers} onManage={setManagingUser} /> },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="View and manage all platform users"
        actions={
          <button
            onClick={() => setShowFilter(true)}
            className={`relative flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
              activeFilterCount > 0
                ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FunnelIcon className="h-4 w-4" /> Filter
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        }
      />

      <Card>
        <div className="mb-4 flex items-center gap-3">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name or email..."
            className="max-w-sm"
          />
          {activeFilterCount > 0 && (
            <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors">
              <XMarkIcon className="h-3.5 w-3.5" /> Clear filters
            </button>
          )}
        </div>
        <Tabs tabs={tabs} />
      </Card>

      <ManageModal
        user={managingUser}
        onClose={() => setManagingUser(null)}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <FilterModal
        open={showFilter}
        filters={filters}
        onChange={handleFilterChange}
        onReset={resetFilters}
        onClose={() => setShowFilter(false)}
      />
    </div>
  );
}
