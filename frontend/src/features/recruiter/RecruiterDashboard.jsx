import {
  PageHeader, StatCard, Card, CardHeader, Badge, Button, EmptyState,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  BriefcaseIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const STATS = [];
const ACTIVITY = [];
const ACTIVE_GIGS = [];
const QUICK_STATS = [];

const STATUS_STYLES = {
  open:        { label: 'Open',        color: 'emerald' },
  in_progress: { label: 'In Progress', color: 'blue'    },
  completed:   { label: 'Completed',   color: 'gray'    },
};

export default function RecruiterDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Recruiter Dashboard"
        subtitle="Manage gigs you've posted and review incoming applicants."
        actions={
          <Button variant="gradient" onClick={() => navigate('/student/post-gig')}>
            <BriefcaseIcon className="h-4 w-4 mr-2" />
            Post New Gig
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {STATS.length === 0 ? (
          <Card className="sm:col-span-2 xl:col-span-4">
            <EmptyState
              icon={BriefcaseIcon}
              title="No recruiter stats yet"
              description="Connect the backend to populate recruiter KPIs."
            />
          </Card>
        ) : (
          STATS.map((s) => (
            <StatCard key={s.label} label={s.label} value={s.value} change={s.change} icon={s.icon} iconColor={s.iconColor} />
          ))
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="lg:col-span-1">
          <CardHeader title="Recent Activity" />
          <div className="space-y-4">
            {ACTIVITY.length === 0 ? (
              <EmptyState
                title="No recent activity"
                description="Activity will appear here once you post gigs and receive applicants."
              />
            ) : (
              ACTIVITY.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative mt-1">
                    <div className={`h-2.5 w-2.5 rounded-full bg-${a.color}-500`} />
                    {i < ACTIVITY.length - 1 && (
                      <div className="absolute left-1/2 top-3 h-full w-px -translate-x-1/2 bg-gray-200" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-gray-700">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Active Gigs table */}
        <Card padding={false} className="lg:col-span-2">
          <div className="px-5 pt-5 pb-3">
            <CardHeader
              title="Your Active Gigs"
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/student/my-gigs')}>View all</Button>}
            />
          </div>
          <Table>
            <TableHead>
              <TableHeader>Gig</TableHeader>
              <TableHeader>Applicants</TableHeader>
              <TableHeader>Budget</TableHeader>
              <TableHeader>Status</TableHeader>
            </TableHead>
            <TableBody>
              {ACTIVE_GIGS.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-sm text-gray-400">
                    No active gigs yet.
                  </TableCell>
                </TableRow>
              ) : (
                ACTIVE_GIGS.map((g) => {
                  const s = STATUS_STYLES[g.status];
                  return (
                    <TableRow key={g.title}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900">{g.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Due {g.deadline}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-700">
                          <UserGroupIcon className="h-4 w-4 text-gray-400" />
                          {g.applicants}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">${g.budget}</TableCell>
                      <TableCell><Badge color={s.color} size="sm">{s.label}</Badge></TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {QUICK_STATS.length === 0 ? (
          <Card className="sm:col-span-3">
            <EmptyState
              title="No quick stats"
              description="Quick stats will appear here once data is available."
            />
          </Card>
        ) : (
          QUICK_STATS.map((stat) => (
            <Card key={stat.label}>
              <div className="text-center">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-xs text-gray-500">{stat.label}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
