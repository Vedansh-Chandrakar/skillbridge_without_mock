import { useState } from 'react';
import {
  PageHeader, Card, CardHeader, Badge, Avatar, Button, Input, Textarea, Modal, EmptyState,
} from '@/components/shared';
import {
  PencilSquareIcon,
  CheckIcon,
  AcademicCapIcon,
  MapPinIcon,
  EnvelopeIcon,
  LinkIcon,
  StarIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

const initialSkills = [];
const PORTFOLIO_ITEMS = [];

export default function StudentProfilePage() {
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState('');
  const [portfolio, setPortfolio] = useState(PORTFOLIO_ITEMS);
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [portfolioForm, setPortfolioForm] = useState({ title: '', description: '', link: '', tags: '' });
  const resumeFile = null;
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    campus: '',
    mode: '',
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    year: '',
    major: '',
    verified: false,
    rating: null,
  });
  const displayName = profile.name || 'My Profile';

  const handleChange = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => setSkills((prev) => prev.filter((s) => s !== skill));

  const handleAddPortfolio = () => {
    const newItem = {
      id: `p-${Date.now()}`,
      title: portfolioForm.title,
      description: portfolioForm.description,
      link: portfolioForm.link,
      tags: portfolioForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      image: null,
      type: 'project',
    };
    setPortfolio((prev) => [...prev, newItem]);
    setPortfolioForm({ title: '', description: '', link: '', tags: '' });
    setShowAddPortfolio(false);
  };

  const removePortfolio = (id) => setPortfolio((prev) => prev.filter((p) => p.id !== id));

  return (
    <div>
      <PageHeader
        title="My Profile"
        subtitle="Manage your public profile and settings."
        actions={
          editing ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setEditing(false)}>Cancel</Button>
              <Button onClick={() => setEditing(false)}>
                <CheckIcon className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </div>
          ) : (
            <Button variant="gradient" onClick={() => setEditing(true)}>
              <PencilSquareIcon className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )
        }
      />

      {/* Profile Header Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <Avatar name={profile.name} size="xl" color="indigo" status="online" />
          <div className="flex-1">
            {editing ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input value={profile.name} onChange={(e) => handleChange('name', e.target.value)} label="Full Name" />
                <Input value={profile.major} onChange={(e) => handleChange('major', e.target.value)} label="Major" />
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
                {(profile.major || profile.year) && (
                  <p className="text-sm text-gray-500 mt-0.5">{profile.major} {profile.major && profile.year ? '•' : ''} {profile.year}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><AcademicCapIcon className="h-4 w-4" /> {profile.campus || '—'}</span>
                  <span className="flex items-center gap-1"><MapPinIcon className="h-4 w-4" /> {profile.location || '—'}</span>
                  <span className="flex items-center gap-1"><EnvelopeIcon className="h-4 w-4" /> {profile.email || '—'}</span>
                </div>
              </>
            )}
            <div className="mt-3 flex gap-2">
              {profile.mode && <Badge color="blue" dot>{profile.mode}</Badge>}
              {profile.verified && <Badge color="green">Verified</Badge>}
              {profile.rating && (
                <Badge color="amber">
                  <span className="flex items-center gap-1"><StarIcon className="h-3 w-3" /> {profile.rating}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bio */}
        <Card>
          <CardHeader title="About" />
          {editing ? (
            <Textarea value={profile.bio} onChange={(e) => handleChange('bio', e.target.value)} rows={4} label="Bio" />
          ) : (
            <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
          )}
        </Card>

        {/* Contact & Links */}
        <Card>
          <CardHeader title="Contact & Links" />
          {editing ? (
            <div className="space-y-3">
              <Input label="Email" value={profile.email} onChange={(e) => handleChange('email', e.target.value)} />
              <Input label="Location" value={profile.location} onChange={(e) => handleChange('location', e.target.value)} />
              <Input label="Website" value={profile.website} onChange={(e) => handleChange('website', e.target.value)} />
              <Input label="GitHub" value={profile.github} onChange={(e) => handleChange('github', e.target.value)} />
              <Input label="LinkedIn" value={profile.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
            </div>
          ) : (
            <dl className="space-y-3">
              {[
                { label: 'Email', value: profile.email },
                { label: 'Location', value: profile.location },
                { label: 'Website', value: profile.website },
                { label: 'GitHub', value: profile.github },
                { label: 'LinkedIn', value: profile.linkedin },
              ].map((d) => (
                <div key={d.label} className="flex justify-between">
                  <dt className="text-sm text-gray-500">{d.label}</dt>
                  <dd className="text-sm font-medium text-gray-900">{d.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader
            title="Skills"
            action={editing && (
              <div className="flex gap-2">
                <input
                  className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  placeholder="Add skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                />
                <Button variant="ghost" size="sm" onClick={addSkill}>+ Add</Button>
              </div>
            )}
          />
          <div className="flex flex-wrap gap-2">
            {skills.length === 0 ? (
              <EmptyState
                title="No skills yet"
                description="Add skills to help recruiters discover you."
              />
            ) : (
              skills.map((skill) => (
                <span key={skill} className="rounded-xl bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-600 ring-1 ring-inset ring-indigo-200 flex items-center gap-1">
                  {skill}
                  {editing && (
                    <button onClick={() => removeSkill(skill)} className="ml-1 text-indigo-400 hover:text-red-500">
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
        </Card>

        {/* Resume & Documents */}
        <Card>
          <CardHeader title="Resume & Documents" />
          <div className="space-y-3">
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-6 text-center">
              <DocumentArrowUpIcon className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">Upload your resume</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
              <Button variant="secondary" size="sm" className="mt-3">Choose File</Button>
            </div>
            {resumeFile ? (
              <div className="rounded-xl border border-gray-200 p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                  <span className="text-xs font-bold text-red-600">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{resumeFile.name}</p>
                  <p className="text-xs text-gray-400">Uploaded {resumeFile.uploadedAt} • {resumeFile.size}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600"><EyeIcon className="h-4 w-4" /></button>
                <button className="text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4" /></button>
              </div>
            ) : (
              <EmptyState
                title="No resume uploaded"
                description="Upload a resume to share with recruiters."
              />
            )}
          </div>
        </Card>

        {/* ── Portfolio / Work Samples ── */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Portfolio & Work Samples"
            action={
              <Button variant="gradient" size="sm" onClick={() => setShowAddPortfolio(true)}>
                <PlusIcon className="h-4 w-4 mr-1" /> Add Project
              </Button>
            }
          />
          {portfolio.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
              <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-sm font-medium text-gray-700">No projects yet</p>
              <p className="text-xs text-gray-400">Showcase your best work to attract recruiters.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {portfolio.map((item) => (
                <div key={item.id} className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
                  {/* Thumbnail placeholder */}
                  <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center relative">
                    <span className="text-3xl">🖥️</span>
                    {editing && (
                      <button
                        onClick={() => removePortfolio(item.id)}
                        className="absolute top-2 right-2 rounded-full bg-white/80 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((t) => (
                        <span key={t} className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">{t}</span>
                      ))}
                    </div>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                        <ArrowTopRightOnSquareIcon className="h-3 w-3" /> View Project
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Stats */}
        <Card className="lg:col-span-2">
          <CardHeader title="Platform Statistics" />
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: 'Gigs Completed', value: '15', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Earnings', value: '$1,240', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Avg. Rating', value: '4.8', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Applications', value: '28', color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Success Rate', value: '87%', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((s) => (
              <div key={s.label} className={`rounded-xl ${s.bg} p-4 text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add Portfolio Modal */}
      <Modal open={showAddPortfolio} onClose={() => setShowAddPortfolio(false)} title="Add Portfolio Project" size="md">
        <div className="space-y-4">
          <Input label="Project Title" value={portfolioForm.title} onChange={(e) => setPortfolioForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Campus Event App" />
          <Textarea label="Description" value={portfolioForm.description} onChange={(e) => setPortfolioForm((p) => ({ ...p, description: e.target.value }))} rows={3} placeholder="Brief description of the project..." />
          <Input label="Link (optional)" value={portfolioForm.link} onChange={(e) => setPortfolioForm((p) => ({ ...p, link: e.target.value }))} placeholder="https://..." />
          <Input label="Tags (comma-separated)" value={portfolioForm.tags} onChange={(e) => setPortfolioForm((p) => ({ ...p, tags: e.target.value }))} placeholder="React, Node.js, UI/UX" />
          <div className="flex gap-3 pt-2">
            <Button variant="gradient" className="flex-1" onClick={handleAddPortfolio} disabled={!portfolioForm.title}>Add Project</Button>
            <Button variant="secondary" onClick={() => setShowAddPortfolio(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
