import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  PageHeader, Card, Badge, Avatar, Button, Modal, SearchInput,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell, EmptyState,
} from '@/components/shared';
import {
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  StarIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { CAMPUS_ENDPOINTS } from '@/config/api';

const statusColor = { pending: 'yellow', shortlisted: 'blue', accepted: 'green', rejected: 'red' };

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('sb_token')}`,
});

export default function CompanyApplicantsPage() {
  const { oppId } = useParams();

  const [applicants, setApplicants]     = useState([]);
  const [roleTitle, setRoleTitle]       = useState('Opportunity');
  const [companyTitle, setCompanyTitle] = useState('');
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [actioningId, setActioningId]   = useState(null);

  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewApp, setPreviewApp]     = useState(null);
  const [showGenerateList, setShowGenerateList] = useState(false);

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(CAMPUS_ENDPOINTS.APPLICANTS(oppId), { headers: authHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load applicants.');
      setRoleTitle(json.role    || 'Opportunity');
      setCompanyTitle(json.company || '');
      setApplicants(json.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [oppId]);

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  const filtered = applicants.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatus = async (id, status) => {
    setActioningId(id);
    try {
      const res  = await fetch(CAMPUS_ENDPOINTS.UPDATE_APPLICANT(oppId, id), {
        method: 'PATCH', headers: authHeaders(), body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Update failed.');
      setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: json.data.status } : a));
      if (previewApp?.id === id) setPreviewApp((p) => ({ ...p, status: json.data.status }));
    } catch (err) {
      alert(err.message);
    } finally {
      setActioningId(null);
    }
  };

  const shortlisted = applicants.filter((a) => a.status === 'shortlisted' || a.status === 'accepted');

  return (
    <div>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Link to="/campus/opportunities" className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <span>Applicants — {roleTitle}</span>
          </div>
        }
        subtitle={companyTitle
          ? `${companyTitle} • ${applicants.length} applicants`
          : `${applicants.length} applicants`}
        actions={
          <Button variant="gradient" onClick={() => setShowGenerateList(true)}>
            <DocumentTextIcon className="h-4 w-4 mr-2" /> Generate Shortlist
          </Button>
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: 'Total', value: applicants.length, cls: 'text-gray-900', bg: 'bg-gray-50' },
          { label: 'Pending', value: applicants.filter((a) => a.status === 'pending').length, cls: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Shortlisted', value: applicants.filter((a) => a.status === 'shortlisted').length, cls: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Rejected', value: applicants.filter((a) => a.status === 'rejected').length, cls: 'text-red-600', bg: 'bg-red-50' },
        ].map((c) => (
          <Card key={c.label}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                <UserGroupIcon className={`h-5 w-5 ${c.cls}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{c.label}</p>
                <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name or email..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-9 text-sm text-gray-700 shadow-sm appearance-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 hover:border-gray-300"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState icon={UserGroupIcon} title="No applicants found" description="No one has applied yet or try adjusting filters." />
      ) : (
        <Card padding={false}>
          <Table>
            <TableHead>
              <TableHeader>Applicant</TableHeader>
              <TableHeader>Campus</TableHeader>
              <TableHeader>GPA</TableHeader>
              <TableHeader>Rating</TableHeader>
              <TableHeader>Skills</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader className="text-right">Actions</TableHeader>
            </TableHead>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id} className="cursor-pointer hover:bg-indigo-50/30" onClick={() => setPreviewApp(a)}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={a.name} size="sm" />
                      <div>
                        <p className="font-semibold text-gray-900">{a.name}</p>
                        <p className="text-xs text-gray-400">{a.major} • {a.year}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge color="blue" size="sm">{a.campus}</Badge></TableCell>
                  <TableCell className="font-medium text-gray-700">{a.gpa}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1 text-sm text-amber-600">
                      <StarIcon className="h-3.5 w-3.5" /> {a.rating}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {a.skills.slice(0, 2).map((s) => <span key={s} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">{s}</span>)}
                      {a.skills.length > 2 && <span className="text-xs text-gray-400">+{a.skills.length - 2}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge color={statusColor[a.status]} dot>{a.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      {(a.status === 'pending') && (
                        <>
                          <button onClick={() => handleStatus(a.id, 'shortlisted')} disabled={actioningId === a.id} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50" title="Shortlist">
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleStatus(a.id, 'rejected')} disabled={actioningId === a.id} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50" title="Reject">
                            <XCircleIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button onClick={() => setPreviewApp(a)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors" title="View">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      </>
      )}

      {/* ── Applicant Preview Modal ── */}      <Modal open={!!previewApp} onClose={() => setPreviewApp(null)} title="Applicant Profile" size="lg">
        {previewApp && (
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Avatar name={previewApp.name} size="lg" />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{previewApp.name}</h3>
                <p className="text-sm text-gray-500">{previewApp.email}</p>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><AcademicCapIcon className="h-4 w-4" /> {previewApp.major} • {previewApp.year}</span>
                  <span className="flex items-center gap-1">🎓 GPA: {previewApp.gpa}</span>
                </div>
              </div>
              <Badge color={statusColor[previewApp.status]} size="lg">{previewApp.status}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-amber-50 p-3 text-center">
                <p className="text-lg font-bold text-amber-600 flex items-center justify-center gap-1"><StarIcon className="h-5 w-5" />{previewApp.rating}</p>
                <p className="text-xs text-amber-700">Rating</p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-3 text-center">
                <p className="text-lg font-bold text-indigo-600">{previewApp.completedGigs}</p>
                <p className="text-xs text-indigo-700">Completed Gigs</p>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3 text-center">
                <p className="text-lg font-bold text-emerald-600">{previewApp.resume ? '✓' : '✕'}</p>
                <p className="text-xs text-emerald-700">Resume</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {previewApp.skills.map((s) => <span key={s} className="rounded-lg bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">{s}</span>)}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Cover Letter</h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-white border border-gray-100 rounded-xl p-4">{previewApp.coverLetter}</p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              {previewApp.status === 'pending' && (
                <>
                  <Button variant="gradient" className="flex-1" disabled={actioningId === previewApp.id} onClick={() => handleStatus(previewApp.id, 'shortlisted')}>
                    <CheckCircleIcon className="h-4 w-4 mr-2" /> {actioningId === previewApp.id ? 'Saving…' : 'Shortlist'}
                  </Button>
                  <Button variant="danger" className="flex-1" disabled={actioningId === previewApp.id} onClick={() => handleStatus(previewApp.id, 'rejected')}>
                    <XCircleIcon className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </>
              )}
              {previewApp.status === 'shortlisted' && (
                <Button variant="gradient" className="flex-1" disabled={actioningId === previewApp.id} onClick={() => handleStatus(previewApp.id, 'accepted')}>
                  <CheckCircleIcon className="h-4 w-4 mr-2" /> {actioningId === previewApp.id ? 'Saving…' : 'Accept'}
                </Button>
              )}
              <Button variant="secondary" onClick={() => setPreviewApp(null)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Generate Shortlist Modal ── */}
      <Modal open={showGenerateList} onClose={() => setShowGenerateList(false)} title="Shortlisted Candidates" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Below are all shortlisted/accepted candidates for <strong>{roleTitle}</strong>{companyTitle ? ` at ${companyTitle}` : ''}.</p>
          {shortlisted.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-500">No candidates have been shortlisted yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shortlisted.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <Avatar name={a.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                    <p className="text-xs text-gray-400">{a.email} • {a.campus} • GPA {a.gpa}</p>
                  </div>
                  <Badge color={statusColor[a.status]} size="sm">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <Button variant="gradient" className="flex-1">
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" /> Export as CSV
            </Button>
            <Button variant="secondary" className="flex-1">
              <PrinterIcon className="h-4 w-4 mr-2" /> Print
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
