import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { ROLES, STUDENT_MODES } from '@/models';
import { useAuthContext } from './AuthContext';

const RoleContext = createContext(null);

/**
 * Manages the student's active mode (Freelancer ↔ Recruiter toggle)
 * and exposes permission helpers used throughout the app.
 */
export function RoleProvider({ children }) {
  const { user } = useAuthContext();

  /** Whether this student can switch between modes. */
  const canToggle = user?.type === ROLES.STUDENT && user?.registeredModes === 'both';

  const [activeMode, setActiveMode] = useState(
    user?.activeMode ?? STUDENT_MODES.FREELANCER,
  );

  /**
   * Sync activeMode whenever the logged-in user changes (login/logout/switch).
   * useState initializer only runs once on mount, so we need this effect
   * to handle cases where login() is called after the provider is already mounted.
   */
  useEffect(() => {
    setActiveMode(user?.activeMode ?? STUDENT_MODES.FREELANCER);
  }, [user?.id, user?.activeMode]);

  /** Toggle between Freelancer and Recruiter modes (students with 'both' only). */
  const toggleMode = useCallback(() => {
    if (!canToggle) return;
    setActiveMode((prev) =>
      prev === STUDENT_MODES.FREELANCER
        ? STUDENT_MODES.RECRUITER
        : STUDENT_MODES.FREELANCER,
    );
  }, [canToggle]);

  /** The effective role used for RBAC checks. */
  const effectiveRole = useMemo(() => {
    if (!user) return null;
    if (user.type === ROLES.STUDENT) return activeMode; // 'freelancer' | 'recruiter'
    return user.type; // 'admin' | 'campus'
  }, [user, activeMode]);

  /**
   * Check whether the current user has one of the allowed roles.
   * @param {string[]} allowed - e.g. ['admin','campus']
   */
  const hasAccess = useCallback(
    (allowed = []) => allowed.includes(effectiveRole),
    [effectiveRole],
  );

  const value = useMemo(
    () => ({ activeMode, effectiveRole, toggleMode, hasAccess, canToggle }),
    [activeMode, effectiveRole, toggleMode, hasAccess, canToggle],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRoleContext() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    // Return safe defaults — happens only during HMR module re-evaluation.
    // The tree will re-render with the correct provider on the next cycle.
    return {
      activeMode: STUDENT_MODES.FREELANCER,
      effectiveRole: null,
      toggleMode: () => {},
      hasAccess: () => false,
      canToggle: false,
    };
  }
  return ctx;
}
