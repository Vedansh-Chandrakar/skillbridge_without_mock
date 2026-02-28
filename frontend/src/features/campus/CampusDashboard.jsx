import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageHeader, Card, CardHeader, Badge, Avatar, Button, EmptyState,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  UserGroupIcon,
  CheckBadgeIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { CAMPUS_ENDPOINTS } from '@/config/api';

const modeColor     = { Freelancer: 'blue', Recruiter: 'purple', Both: 'cyan' };
const oppStatusColor = { active: 'green', closed: 'gray', draft: 'yellow' };

const STAT_ICONS = [UserGroupIcon, CheckBadgeIcon, ClipboardDocumentListIcon, BuildingOffice2Icon];
const STAT_ICON_COLORS = ['text-indigo-600', 'text-emerald-600', 'text-amber-600', 'text-purple-600'];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('sb_token')}`,
});

export default function CampusDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [data,    setData]    = useState({
    stats: [], quickMetrics: [], recentStudents: [], recentOpportunities: [],
  });

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(CAMPUS_ENDPOINTS.DASHBOARD, { headers: authHeaders() });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to load dashboard.');
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const { stats, quickMetrics, recentStudents, recentOpportunities } = data;

  return (
    <div>
      <PageHeader
        title="Campus Dashboard"
        subtitle="Manage students, gigs, and recruitment for your institution."
        actions={
          <Button variant="gradient" onClick={() => navigate('/campus/verifications')}>
            <CheckBadgeIcon className="h-4 w-4 mr-2" />
            Verify Students
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-4">
            {stats.length === 0 ? (
              <Card className="sm:col-span-2 xl:col-span-4">
                <EmptyState
                  icon={ChartBarIcon}
                  title="No campus stats yet"
                  description="Connect the backend to populate campus KPIs."
                />
              </Card>
            ) : (
              stats.map((s, i) => {
                const Icon = STAT_ICONS[i] || ChartBarIcon;
                return (
                  <Card key={s.label}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${s.bgClass} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${s.colorClass}`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{s.label}</p>
                        <p className={`text-2xl font-bold ${s.colorClass}`}>{s.value}</p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid gap-4 sm:grid-cols-3 mb-8">
            {quickMetrics.length === 0 ? (
              <Card className="sm:col-span-3">
                <EmptyState
                  icon={ArrowTrendingUpIcon}
                  title="No quick metrics yet"
                  description="Performance summaries will appear once data is available."
                />
              </Card>
            ) : (
              quickMetrics.map((m) => (
                <Card key={m.label}>
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${m.bgClass}`}>
                      <ArrowTrendingUpIcon className={`h-5 w-5 ${m.colorClass}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{m.label}</p>
                      <p className={`text-lg font-bold ${m.colorClass}`}>{m.value}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Students */}
            <Card padding={false}>
              <div className="px-5 pt-5 pb-3">
                <CardHeader
                  title="Recent Students"
                  action={<Button variant="ghost" size="sm" onClick={() => navigate('/campus/students')}>View all</Button>}
                />
              </div>
              <Table>
                <TableHead>
                  <TableHeader>Student</TableHeader>
                  <TableHeader>Mode</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableHead>
                <TableBody>
                  {recentStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-sm text-gray-400">
                        No recent students yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentStudents.map((s) => (
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
                          <Badge color={s.verified ? 'green' : 'yellow'} dot size="sm">
                            {s.verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>

            {/* Recent Opportunities */}
            <Card padding={false}>
              <div className="px-5 pt-5 pb-3">
                <CardHeader
                  title="Recent Opportunities"
                  action={<Button variant="ghost" size="sm" onClick={() => navigate('/campus/opportunities')}>View all</Button>}
                />
              </div>
              <Table>
                <TableHead>
                  <TableHeader>Opportunity</TableHeader>
                  <TableHeader>Apps</TableHeader>
                  <TableHeader>Status</TableHeader>
                </TableHead>
                <TableBody>
                  {recentOpportunities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-sm text-gray-400">
                        No opportunities yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentOpportunities.map((o) => (
                      <TableRow key={o.id}>
                        <TableCell>
                          <div>
                            <p className="font-semibold text-gray-900">{o.title}</p>
                            <p className="text-xs text-gray-500">by {o.postedBy}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-medium">{o.applications}</TableCell>
                        <TableCell>
                          <Badge color={oppStatusColor[o.status]} size="sm">{o.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}