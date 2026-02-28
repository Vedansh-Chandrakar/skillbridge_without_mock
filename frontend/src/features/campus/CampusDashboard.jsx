import { useNavigate } from 'react-router-dom';
import {
  PageHeader, StatCard, Card, CardHeader, Badge, Avatar, Button, EmptyState,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  ChartBarIcon,
  CheckBadgeIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const stats = [];
const recentStudents = [];
const recentGigs = [];
const quickMetrics = [];

const modeColor = { Freelancer: 'blue', Recruiter: 'purple', Both: 'cyan' };
const gigStatusColor = { open: 'green', 'in-progress': 'yellow', completed: 'indigo' };

export default function CampusDashboard() {
  const navigate = useNavigate();
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
          stats.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              change={s.change}
              icon={s.icon}
              iconColor={s.iconColor}
            />
          ))
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
          quickMetrics.map((metric) => (
            <Card key={metric.label}>
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.bg}`}>
                  <metric.Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="text-lg font-bold text-gray-900">{metric.value}</p>
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
                  <TableRow key={s.email}>
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

        {/* Recent Gigs */}
        <Card padding={false}>
          <div className="px-5 pt-5 pb-3">
            <CardHeader
              title="Recent Gigs"
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/campus/gigs')}>View all</Button>}
            />
          </div>
          <Table>
            <TableHead>
              <TableHeader>Gig</TableHeader>
              <TableHeader>Apps</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableHead>
            <TableBody>
              {recentGigs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-sm text-gray-400">
                    No recent gigs yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentGigs.map((g) => (
                  <TableRow key={g.title}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-gray-900">{g.title}</p>
                        <p className="text-xs text-gray-500">by {g.postedBy}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium">{g.applications}</TableCell>
                    <TableCell>
                      <Badge color={gigStatusColor[g.status]} size="sm">{g.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
