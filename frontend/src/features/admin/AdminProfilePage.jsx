import { useState } from 'react';
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  KeyIcon,
  PencilSquareIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';

/* ── Stat chip ────────────────────────────────────────── */
function StatChip({ icon: Icon, label, value, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber:  'bg-amber-50  text-amber-700  border-amber-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <div className={`flex items-center gap-3 rounded-2xl border px-5 py-4 ${colors[color]}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/60`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="mt-0.5 text-xs font-medium opacity-70">{label}</p>
      </div>
    </div>
  );
}

/* ── Section card ─────────────────────────────────────── */
function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-100/60">
      <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

/* ── Field row ────────────────────────────────────────── */
function Field({ label, value, editable, onChange }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    if (onChange) onChange(draft);
    setEditing(false);
  };

  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-gray-50 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && save()}
            className="mt-1 w-full rounded-lg border border-indigo-200 bg-indigo-50/30 px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
        ) : (
          <p className="mt-0.5 text-sm font-medium text-gray-900">{value || '—'}</p>
        )}
      </div>
      {editable && (
        editing ? (
          <div className="flex gap-2 pt-5 flex-shrink-0">
            <button onClick={save} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Save</button>
            <button onClick={() => { setDraft(value); setEditing(false); }} className="text-xs text-gray-400 hover:text-gray-600">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="mt-4 flex-shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <PencilSquareIcon className="h-4 w-4" />
          </button>
        )
      )}
    </div>
  );
}

/* ── Main page ────────────────────────────────────────── */
export default function AdminProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name:      user?.name     ?? '',
    email:     user?.email    ?? '',
    phone:     user?.phone    ?? '',
    role:      user?.role     ?? '',
    location:  user?.location ?? '',
    bio:       user?.bio      ?? '',
    joined:    user?.joined   ?? '',
    lastLogin: user?.lastLogin ?? '',
  });

  const [passwords, setPasswords] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdMsg, setPwdMsg] = useState(null);
  const [twoFA, setTwoFA] = useState(false);

  const update = (key) => (val) => setProfile((p) => ({ ...p, [key]: val }));

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwords.newPwd !== passwords.confirm) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.newPwd.length < 8) {
      setPwdMsg({ type: 'error', text: 'Password must be at least 8 characters.' });
      return;
    }
    setPwdMsg({ type: 'success', text: 'Password updated successfully.' });
    setPasswords({ current: '', newPwd: '', confirm: '' });
  };

  const stats = [];

  return (
    <div className="space-y-6">
      {/* ── Hero card ─────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-100/60">
        {/* Gradient strip */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Avatar + meta */}
        <div className="relative px-6 pb-6">
          {/* Avatar — overlaps banner via negative margin, floated independently */}
          <div className="absolute left-6 -top-12">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200 text-white text-3xl font-bold">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm">
                <CameraIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Name & role — indented to clear avatar, top-padded to sit below banner */}
          <div className="pl-32 pt-3 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-0.5 text-xs font-semibold text-indigo-700">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                {profile.role}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <ClockIcon className="h-3.5 w-3.5" />
                Joined {profile.joined}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <CheckCircleIcon className="h-3.5 w-3.5 text-emerald-500" />
                Last login: {profile.lastLogin}
              </span>
            </div>
          </div>
          {/* Spacer so the card has height below the avatar */}
          <div className="h-6" />
        </div>
      </div>

      {/* ── Stats row ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => <StatChip key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ── Personal info ──────────────────────────── */}
        <Section title="Personal Information" icon={UserCircleIcon}>
          <Field label="Full Name"    value={profile.name}     editable onChange={update('name')}     />
          <Field label="Email"        value={profile.email}    editable onChange={update('email')}    />
          <Field label="Phone"        value={profile.phone}    editable onChange={update('phone')}    />
          <Field label="Location"     value={profile.location} editable onChange={update('location')} />
          <Field label="Role"         value={profile.role}                                             />
        </Section>

        {/* ── About ──────────────────────────────────── */}
        <Section title="About" icon={PencilSquareIcon}>
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-400">Bio</p>
            <textarea
              value={profile.bio}
              onChange={(e) => update('bio')(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <p className="text-right text-xs text-gray-400">{profile.bio.length} chars</p>
          </div>
        </Section>

        {/* ── Security ───────────────────────────────── */}
        <Section title="Security & Password" icon={KeyIcon}>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            {[
              { id: 'current', label: 'Current Password',  key: 'current' },
              { id: 'new',     label: 'New Password',       key: 'newPwd'  },
              { id: 'confirm', label: 'Confirm New Password', key: 'confirm' },
            ].map(({ id, label, key }) => (
              <div key={id}>
                <label className="text-xs font-medium text-gray-400">{label}</label>
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            ))}

            {pwdMsg && (
              <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm ${
                pwdMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-red-50 text-red-600'
              }`}>
                {pwdMsg.type === 'success'
                  ? <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                  : <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                }
                {pwdMsg.text}
              </div>
            )}

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              Update Password
            </button>
          </form>
        </Section>

        {/* ── Account preferences ────────────────────── */}
        <Section title="Account Preferences" icon={ShieldCheckIcon}>
          <div className="space-y-4">
            {/* 2FA toggle */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="mt-0.5 text-xs text-gray-500">Add an extra layer of security to your account.</p>
              </div>
              <button
                onClick={() => setTwoFA((v) => !v)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                  twoFA ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4.5 w-4.5 h-[18px] w-[18px] transform rounded-full bg-white shadow-sm transition-transform ${
                  twoFA ? 'translate-x-5' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500 leading-relaxed">
              <p className="font-medium text-gray-700 mb-1">Admin account permissions</p>
              <ul className="space-y-1 list-inside list-disc">
                <li>Manage all campuses and users</li>
                <li>Approve / reject verification requests</li>
                <li>Moderate gigs and reported content</li>
                <li>Access platform-wide analytics</li>
              </ul>
            </div>

            {/* Danger zone */}
            <div className="rounded-xl border border-red-100 bg-red-50/40 px-4 py-3">
              <p className="text-xs font-semibold text-red-700">Danger Zone</p>
              <p className="mt-0.5 text-xs text-red-500">Deactivating your admin account will revoke all permissions immediately.</p>
              <button className="mt-2.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                Deactivate Account
              </button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
