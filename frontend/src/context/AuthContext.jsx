import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { ROLES, STUDENT_MODES } from '@/models';

const AuthContext = createContext(null);

const STORAGE_KEY = 'sb_user';
const STUDENT_MODE_KEY = 'sb_student_mode';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = useCallback((userData) => {
    if (!userData) return;
    const nextUser = {
      ...userData,
      activeMode:
        userData?.type === ROLES.STUDENT
          ? (userData?.activeMode ?? STUDENT_MODES.FREELANCER)
          : userData?.activeMode,
    };

    if (nextUser?.type === ROLES.STUDENT && nextUser?.registeredModes) {
      localStorage.setItem(STUDENT_MODE_KEY, nextUser.registeredModes);
    }

    setUser(nextUser);
    setIsAuthenticated(true);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STUDENT_MODE_KEY);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, logout }),
    [user, isAuthenticated, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within <AuthProvider>');
  return ctx;
}
