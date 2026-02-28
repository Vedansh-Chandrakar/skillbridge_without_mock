import { useRole } from '@/hooks';
import { STUDENT_MODES } from '@/models';
import FreelancerDashboard from './FreelancerDashboard';
import RecruiterDashboard from '../recruiter/RecruiterDashboard';

/**
 * Thin dispatcher — renders the correct dashboard based on the student's active mode.
 * Freelancer-only students always see FreelancerDashboard.
 * Recruiter-only students always see RecruiterDashboard.
 * "Both" students see whichever mode is currently toggled.
 */
export default function StudentDashboard() {
  const { activeMode } = useRole();
  return activeMode === STUDENT_MODES.RECRUITER
    ? <RecruiterDashboard />
    : <FreelancerDashboard />;
}
