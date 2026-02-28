import { useState, useEffect, useCallback } from 'react';
import { PageHeader, Button, Card, CardHeader, Input, Textarea, Badge, EmptyState } from '@/components/shared';
import {
  BuildingLibraryIcon,
  GlobeAltIcon,
  MapPinIcon,
  PencilSquareIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { CAMPUS_ENDPOINTS } from '@/config/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('sb_token')}`,
});

export default function CampusProfilePage() {
  const [editing, setEditing]   = useState(false);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [profile, setProfile]   = useState({
    name: '', domain: '', location: '', description: '',
    website: '', contactEmail: '', contactPhone: '', established: '',
  });
  const [editForm, setEditForm] = useState({});
  const [stats, setStats]       = useState([]);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(CAMPUS_ENDPOINTS.PROFILE, { headers: authHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load profile.');
      setProfile(json.data);
      setStats(json.data.stats || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const openEdit = () => {
    setEditForm({
      location:     profile.location,
      description:  profile.description,
      website:      profile.website,
      contactEmail: profile.contactEmail,
      contactPhone: profile.contactPhone,
      established:  profile.established,
    });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res  = await fetch(CAMPUS_ENDPOINTS.UPDATE_PROFILE, {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify(editForm),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Save failed.');
      setProfile((prev) => ({ ...prev, ...json.data }));
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const field = (key) => editForm[key] ?? '';
  const set   = (key) => (e) => setEditForm((f) => ({ ...f, [key]: e.target.value }));

  const displayName = profile.name || 'Campus Profile';

  return (
    <div>
      <PageHeader
        title="Campus Profile"
        subtitle="Manage your institution's public profile."
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(false)} disabled={saving}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                <CheckIcon className="h-4 w-4 mr-2" />
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <Button variant="gradient" onClick={openEdit}>
              <PencilSquareIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )
        }
      />

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <>
          {/* Header Card */}
          <Card className="mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                <BuildingLibraryIcon className="h-10 w-10" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <GlobeAltIcon className="h-4 w-4" /> {profile.domain || '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" /> {profile.location || '—'}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  {profile.established && <Badge color="blue">Est. {profile.established}</Badge>}
                  {profile.status && (
                    <Badge color={profile.status === 'active' ? 'green' : profile.status === 'pending' ? 'yellow' : 'gray'}>
                      {profile.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* About */}
            <Card>
              <CardHeader title="About" />
              {editing ? (
                <Textarea
                  value={field('description')}
                  onChange={set('description')}
                  rows={4}
                  label="Description"
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{profile.description || '—'}</p>
              )}
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader title="Contact Information" />
              {editing ? (
                <div className="space-y-4">
                  <Input label="Website"      value={field('website')}      onChange={set('website')}      />
                  <Input label="Contact Email" value={field('contactEmail')} onChange={set('contactEmail')} />
                  <Input label="Phone"         value={field('contactPhone')} onChange={set('contactPhone')} />
                  <Input label="Location"      value={field('location')}     onChange={set('location')}     />
                  <Input label="Established"   value={field('established')}  onChange={set('established')} placeholder="e.g. 1990" />
                </div>
              ) : (
                <dl className="space-y-3">
                  {[
                    { label: 'Website',  value: profile.website      },
                    { label: 'Email',    value: profile.contactEmail  },
                    { label: 'Phone',    value: profile.contactPhone  },
                    { label: 'Location', value: profile.location      },
                  ].map((d) => (
                    <div key={d.label} className="flex justify-between">
                      <dt className="text-sm text-gray-500">{d.label}</dt>
                      <dd className="text-sm font-medium text-gray-900">{d.value || '—'}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Card>

            {/* Platform Stats */}
            <Card className="lg:col-span-2">
              <CardHeader title="Platform Statistics" />
              {stats.length === 0 ? (
                <EmptyState
                  title="No stats available"
                  description="Platform statistics will appear once data is available."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-xl bg-gray-50 p-4 text-center">
                      <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                      <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
