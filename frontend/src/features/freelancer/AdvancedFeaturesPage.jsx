import { useRole } from '@/hooks';
import { STUDENT_MODES } from '@/models';
import FreelancerAdvancedPage from './FreelancerAdvancedPage';
import RecruiterAdvancedPage from '../recruiter/RecruiterAdvancedPage';

export default function AdvancedFeaturesPage() {
  const { activeMode } = useRole();
  return activeMode === STUDENT_MODES.RECRUITER
    ? <RecruiterAdvancedPage />
    : <FreelancerAdvancedPage />;
}
