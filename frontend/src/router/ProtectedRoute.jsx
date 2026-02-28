import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, useRole } from '@/hooks';

/**
 * Route guard that checks authentication and optionally checks
 * whether the user's effective role is in the `allowed` list.
 *
 * @param {Object}   props
 * @param {string[]} [props.allowed] – roles permitted (omit to allow any authenticated user)
 * @param {string}   [props.redirectTo='/login']
 */
export function ProtectedRoute({ allowed, redirectTo = '/login' }) {
  const { isAuthenticated, user } = useAuth();
  const { effectiveRole } = useRole();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowed && !allowed.includes(effectiveRole) && !allowed.includes(user.type)) {
    // User is authenticated but doesn't have the right role → send to their own dashboard
    const fallback = {
      admin: '/admin',
      campus: '/campus',
      student: '/student',
    };
    return <Navigate to={fallback[user.type] ?? '/login'} replace />;
  }

  return <Outlet />;
}
