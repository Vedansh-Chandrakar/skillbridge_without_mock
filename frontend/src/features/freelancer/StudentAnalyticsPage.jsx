import { useRole } from '@/hooks';
import { STUDENT_MODES } from '@/models';
import FreelancerAnalyticsPage from './FreelancerAnalyticsPage';
import RecruiterAnalyticsPage from '../recruiter/RecruiterAnalyticsPage';

export default function StudentAnalyticsPage() {
  const { activeMode } = useRole();
  return activeMode === STUDENT_MODES.RECRUITER
    ? <RecruiterAnalyticsPage />
    : <FreelancerAnalyticsPage />;
}
