import { useRoleContext } from '@/context/RoleContext';

/**
 * Convenience wrapper around RoleContext.
 * Returns `effectiveRole`, `activeMode`, `toggleMode`, and `hasAccess`.
 */
export function useRole() {
  return useRoleContext();
}
