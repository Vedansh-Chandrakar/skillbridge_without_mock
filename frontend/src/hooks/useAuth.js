import { useAuthContext } from '@/context/AuthContext';

/**
 * Convenience wrapper around AuthContext.
 * Provides `user`, `isAuthenticated`, `login`, `logout`.
 */
export function useAuth() {
  return useAuthContext();
}
