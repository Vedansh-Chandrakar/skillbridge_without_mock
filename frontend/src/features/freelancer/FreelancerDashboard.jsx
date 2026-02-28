import {
  PageHeader, StatCard, Card, CardHeader, Badge, Button, EmptyState,
  Table, TableHead, TableHeader, TableBody, TableRow, TableCell,
} from '@/components/shared';
import {
  BriefcaseIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const STATS = [];
const ACTIVITY = [];
const RECOMMENDED_GIGS = [];
const QUICK_STATS = [];

export default function FreelancerDashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader
        title="Freelancer Dashboard"
        subtitle="Discover gigs that match your skills and track applications."
        actions={
          <Button variant="gradient" onClick={() => navigate('/student/gigs')}>
            <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
            Browse Gigs
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {STATS.length === 0 ? (
          <Card className="sm:col-span-2 xl:col-span-4">
            <EmptyState
              icon={BriefcaseIcon}
              title="No stats yet"
              description="Connect the backend to show your freelancer stats."
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
                description="Activity will appear here once you start applying and working on gigs."
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

        {/* Recommended Gigs */}
        <Card padding={false} className="lg:col-span-2">
          <div className="px-5 pt-5 pb-3">
            <CardHeader
              title="Recommended for You"
              action={<Button variant="ghost" size="sm" onClick={() => navigate('/student/gigs')}>View all</Button>}
            />
          </div>
          <Table>
            <TableHead>
              <TableHeader>Gig</TableHeader>
              <TableHeader>Budget</TableHeader>
              <TableHeader>Deadline</TableHeader>
              <TableHeader>Campus</TableHeader>
            </TableHead>
            <TableBody>
                {RECOMMENDED_GIGS.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-sm text-gray-400">
                      No recommendations yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  RECOMMENDED_GIGS.map((g) => (
                    <TableRow key={g.title}>
                      <TableCell>
                        <div>
                          <p className="font-semibold text-gray-900">{g.title}</p>
                          <div className="flex gap-1 mt-1">
                            {g.tags.map((t) => (
                              <span key={t} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">{t}</span>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-emerald-600">${g.budget}</TableCell>
                      <TableCell className="text-gray-500">{g.deadline}</TableCell>
                      <TableCell><Badge color="blue" size="sm">{g.campus}</Badge></TableCell>
                    </TableRow>
                  ))
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
